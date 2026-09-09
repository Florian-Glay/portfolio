// Rendu canvas du simulateur microfluidique. Toute la geometrie visuelle est
// recalculee au resize pour rester lisible dans l'iframe responsive.
export class DeviceRenderer {
  constructor(canvas, simulation) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.simulation = simulation;
    this.geometry = {};
  }

  resize(width, height) {
    // Le canvas est rendu en haute densite pour rester net sur ecrans Retina.
    const pixelRatio = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = width * pixelRatio;
    this.canvas.height = height * pixelRatio;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    if (this.simulation.deviceModel === 'hook') {
      const radius = Math.max(32, Math.min(58, width * 0.082, height * 0.13));
      const inlet = { x: width * 0.22, y: height * 0.58 };
      const outlet = { x: width * 0.78, y: height * 0.58 };
      const startX = inlet.x + radius * 0.72;
      const endX = outlet.x - radius * 0.72;
      const centerY = inlet.y;
      const amplitude = Math.min(54, Math.max(30, height * 0.075));
      const zigzagPoints = [];
      const zigzagCount = 10;
      for (let index = 0; index <= zigzagCount; index += 1) {
        const ratio = index / zigzagCount;
        const isEnd = index === 0 || index === zigzagCount;
        zigzagPoints.push({
          x: startX + (endX - startX) * ratio,
          y: centerY + (isEnd ? 0 : (index % 2 === 0 ? amplitude : -amplitude))
        });
      }
      this.geometry = {
        width, height, radius,
        wells: [inlet, outlet],
        hookPath: zigzagPoints
      };
      return;
    }

    if (this.simulation.deviceModel === 'parallel') {
      const radius = Math.max(30, Math.min(51, width * 0.075, height * 0.11));
      this.geometry = {
        width, height, radius,
        wells: [
          { x: width * 0.36, y: height * 0.34 },
          { x: width * 0.64, y: height * 0.34 },
          { x: width * 0.36, y: height * 0.74 },
          { x: width * 0.64, y: height * 0.74 }
        ]
      };
      return;
    }

    if (this.simulation.deviceModel === 'bridge') {
      const radius = Math.max(30, Math.min(49, width * 0.072, height * 0.105));
      this.geometry = {
        width, height, radius,
        wells: [
          { x: width * 0.28, y: height * 0.34 },
          { x: width * 0.28, y: height * 0.75 },
          { x: width * 0.72, y: height * 0.34 },
          { x: width * 0.72, y: height * 0.75 }
        ]
      };
      return;
    }

    const channelLength = width * 0.76;
    const centerY = height * 0.54;
    const radius = Math.max(34, Math.min(72, width * 0.055, height * 0.15));
    this.geometry = {
      width, height, radius,
      wells: [
        { x: width / 2 - channelLength / 2, y: centerY },
        { x: width / 2 + channelLength / 2, y: centerY }
      ]
    };
  }

  render() {
    // Le renderer choisit le dessin adapte au modele actif dans la simulation.
    const { width, height } = this.geometry;
    this.context.clearRect(0, 0, width, height);
    if (this.simulation.deviceModel === 'bridge') this.drawBridgeDevice();
    else if (this.simulation.deviceModel === 'parallel') this.drawParallelDevice();
    else if (this.simulation.deviceModel === 'hook') this.drawHookDevice();
    else this.drawLinearDevice();
  }

  getWellAt(point) {
    const { wells, radius } = this.geometry;
    for (let index = 0; index < wells.length; index += 1) {
      if (Math.hypot(point.x - wells[index].x, point.y - wells[index].y) < radius * 1.08) return index;
    }
    return null;
  }

  mixtureColor(mixture, opacity = 1) {
    // Convertit le melange numerique en couleur CSS transparente.
    if (!mixture || mixture.a < 0.001) return 'rgba(0,0,0,0)';
    const clamp = (value) => Math.max(0, Math.min(1, value));
    const red = Math.round(255 * clamp(mixture.r / mixture.a));
    const green = Math.round(255 * clamp(mixture.g / mixture.a));
    const blue = Math.round(255 * clamp(mixture.b / mixture.a));
    return `rgba(${red},${green},${blue},${Math.min(1, opacity * mixture.a * 2.4)})`;
  }

  drawLinearDevice() {
    const { wells, radius, width, height } = this.geometry;
    const [inlet, outlet] = wells;
    const horizontalPadding = Math.min(76, width * 0.045);
    const verticalPadding = Math.min(76, height * 0.13);
    this.context.save();
    this.context.translate(0, -8);
    this.drawPlate(
      inlet.x - radius - horizontalPadding,
      inlet.y - radius - verticalPadding,
      outlet.x - inlet.x + radius * 2 + horizontalPadding * 2,
      radius * 2 + verticalPadding * 2
    );
    this.drawLineCells(
      { x: inlet.x + radius * 0.62, y: inlet.y },
      { x: outlet.x - radius * 0.62, y: outlet.y },
      this.simulation.channel,
      15,
      10
    );
    this.simulation.wells.forEach((well, index) => this.drawWell(wells[index], radius, well));
    this.context.restore();
  }

  drawHookDevice() {
    const { wells, radius, width, height, hookPath } = this.geometry;
    const [inlet, outlet] = wells;
    const plateX = Math.max(8, inlet.x - radius - width * 0.08);
    const plateY = Math.max(7, inlet.y - radius - height * 0.18);
    const plateWidth = Math.min(width - plateX * 2, outlet.x - inlet.x + radius * 2 + width * 0.18);
    const plateHeight = Math.min(height - plateY - 18, radius * 2 + height * 0.34);

    this.context.save();
    this.context.translate(0, -4);
    this.drawPlate(plateX, plateY, plateWidth, plateHeight);
    this.drawSegmentedLineCells(hookPath, this.simulation.channel, 18, 9);
    this.simulation.wells.forEach((well, index) => this.drawWell(wells[index], radius, well, 0.9));
    this.context.restore();
  }

  drawPorousChamber(startX, endX, y, chamberHeight) {
    const ctx = this.context;
    this.roundedRectangle(
      startX,
      y,
      endX - startX,
      chamberHeight,
      8,
      'rgba(111,139,148,.18)',
      'rgba(82,105,113,.42)'
    );

    const columns = 15;
    const rows = 4;
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const offset = row % 2 ? 0.5 : 0;
        const x = startX + 10 + (endX - startX - 20) * (column + offset) / columns;
        const obstacleY = y + 10 + row * (chamberHeight - 20) / (rows - 1) + Math.sin(column * 2.1 + row) * 2;
        this.ellipse(x, obstacleY, 3.2, 2.4, 'rgba(246,247,243,.82)', 'rgba(92,109,113,.38)', 0.7);
      }
    }
  }

  getPolylineMetrics(points) {
    const segmentLengths = [];
    let totalLength = 0;
    for (let index = 0; index < points.length - 1; index += 1) {
      const length = Math.hypot(points[index + 1].x - points[index].x, points[index + 1].y - points[index].y);
      segmentLengths.push(length);
      totalLength += length;
    }

    const pointAtDistance = (distance) => {
      let remaining = Math.max(0, Math.min(totalLength, distance));
      for (let index = 0; index < segmentLengths.length; index += 1) {
        if (remaining <= segmentLengths[index]) {
          const ratio = segmentLengths[index] === 0 ? 0 : remaining / segmentLengths[index];
          return {
            x: points[index].x + (points[index + 1].x - points[index].x) * ratio,
            y: points[index].y + (points[index + 1].y - points[index].y) * ratio
          };
        }
        remaining -= segmentLengths[index];
      }
      return points[points.length - 1];
    };

    return { segmentLengths, totalLength, pointAtDistance };
  }

  drawRoundedPath(points, radius) {
    const ctx = this.context;
    if (points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let index = 1; index < points.length - 1; index += 1) {
      const previous = points[index - 1];
      const current = points[index];
      const next = points[index + 1];
      const previousLength = Math.hypot(current.x - previous.x, current.y - previous.y);
      const nextLength = Math.hypot(next.x - current.x, next.y - current.y);
      const offset = Math.min(radius, previousLength * 0.45, nextLength * 0.45);
      const before = {
        x: current.x - (current.x - previous.x) / previousLength * offset,
        y: current.y - (current.y - previous.y) / previousLength * offset
      };
      const after = {
        x: current.x + (next.x - current.x) / nextLength * offset,
        y: current.y + (next.y - current.y) / nextLength * offset
      };
      ctx.lineTo(before.x, before.y);
      ctx.quadraticCurveTo(current.x, current.y, after.x, after.y);
    }
    const last = points[points.length - 1];
    ctx.lineTo(last.x, last.y);
  }

  drawPolylineCells(points, cells, baseWidth, fluidWidth) {
    const ctx = this.context;
    const { totalLength, pointAtDistance } = this.getPolylineMetrics(points);

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = baseWidth;
    ctx.strokeStyle = 'rgba(80,91,93,.28)';
    this.drawRoundedPath(points, baseWidth * 1.75);
    ctx.stroke();

    ctx.lineCap = 'round';
    for (let index = 0; index < cells.length - 1; index += 1) {
      const start = pointAtDistance(totalLength * index / (cells.length - 1));
      const end = pointAtDistance(totalLength * (index + 1) / (cells.length - 1));
      ctx.lineWidth = fluidWidth;
      ctx.strokeStyle = this.mixtureColor(cells[index]);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
    this.drawFlowParticles(points, cells, totalLength, pointAtDistance, fluidWidth);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'miter';
  }

  drawFlowParticles(points, cells, totalLength, pointAtDistance, fluidWidth) {
    const ctx = this.context;
    const pressure = this.simulation.wells.length >= 2
      ? this.simulation.wells[0].level - this.simulation.wells[1].level
      : 0;
    const direction = pressure >= 0 ? 1 : -1;
    const activeCells = cells.filter((cell) => cell.a > 0.01).length;
    if (activeCells === 0) return;

    const particleCount = Math.min(42, Math.max(10, Math.round(activeCells * 0.42)));
    const speed = 72 + Math.abs(pressure) * 105;
    const spacing = totalLength / particleCount;

    for (let index = 0; index < particleCount; index += 1) {
      let distance = (this.simulation.time * speed + index * spacing) % totalLength;
      if (direction < 0) distance = totalLength - distance;
      const point = pointAtDistance(distance);
      const cellIndex = Math.max(0, Math.min(cells.length - 1, Math.round(distance / totalLength * (cells.length - 1))));
      const mixture = cells[cellIndex];
      if (mixture.a <= 0.01) continue;

      const pulse = 0.72 + Math.sin(this.simulation.time * 7 + index * 1.9) * 0.18;
      ctx.beginPath();
      ctx.arc(point.x, point.y, Math.max(2.2, fluidWidth * 0.32) * pulse, 0, Math.PI * 2);
      ctx.fillStyle = this.mixtureColor(mixture, 0.92);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.62)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }

  drawSegmentedLineCells(points, cells, baseWidth, fluidWidth) {
    const { segmentLengths, totalLength } = this.getPolylineMetrics(points);
    if (totalLength <= 0) return;

    let travelled = 0;
    for (let index = 0; index < points.length - 1; index += 1) {
      const startCell = Math.floor(travelled / totalLength * (cells.length - 1));
      travelled += segmentLengths[index];
      const endCell = Math.max(startCell + 2, Math.ceil(travelled / totalLength * (cells.length - 1)) + 1);
      this.drawLineCells(
        points[index],
        points[index + 1],
        cells.slice(startCell, Math.min(cells.length, endCell)),
        baseWidth,
        fluidWidth
      );
    }
  }

  drawParallelDevice() {
    const { wells, radius } = this.geometry;
    const [upperInlet, upperOutlet, lowerInlet, lowerOutlet] = wells;
    const x = upperInlet.x - radius - 68;
    const y = upperInlet.y - radius - 48;
    const width = upperOutlet.x - upperInlet.x + radius * 2 + 136;
    const height = lowerInlet.y - upperInlet.y + radius * 2 + 96;

    this.context.save();
    this.context.translate(0, -5);
    this.drawPlate(x, y, width, height);

    this.drawLineCells(
      { x: upperInlet.x + radius * 0.56, y: upperInlet.y },
      { x: upperOutlet.x - radius * 0.56, y: upperOutlet.y },
      this.simulation.bridgeChannels[0],
      16,
      10
    );
    this.drawLineCells(
      { x: lowerInlet.x + radius * 0.56, y: lowerInlet.y },
      { x: lowerOutlet.x - radius * 0.56, y: lowerOutlet.y },
      this.simulation.bridgeChannels[1],
      16,
      10
    );

    this.simulation.wells.forEach((well, index) => {
      this.drawWell(wells[index], radius, well, 0.88);
    });
    this.context.restore();
  }

  drawBridgeDevice() {
    const { wells, radius } = this.geometry;
    const [leftTop, leftBottom, rightTop, rightBottom] = wells;
    const x = leftTop.x - radius - 62;
    const y = leftTop.y - radius - 52;
    const width = rightTop.x - leftTop.x + radius * 2 + 124;
    const height = leftBottom.y - leftTop.y + radius * 2 + 104;

    this.context.save();
    this.context.translate(0, -5);
    this.drawPlate(x, y, width, height);

    const leftStart = { x: leftTop.x, y: leftTop.y + radius * 0.58 };
    const leftEnd = { x: leftBottom.x, y: leftBottom.y - radius * 0.58 };
    const rightStart = { x: rightTop.x, y: rightTop.y + radius * 0.58 };
    const rightEnd = { x: rightBottom.x, y: rightBottom.y - radius * 0.58 };

    this.simulation.microbridges.forEach((bridge, row) => {
      const fraction = (row + 1) / (this.simulation.microbridges.length + 1);
      const bridgeY = leftStart.y + (leftEnd.y - leftStart.y) * fraction;
      const start = { x: leftTop.x + 7, y: bridgeY };
      const end = { x: rightTop.x - 7, y: bridgeY };
      this.drawLineCells(start, end, bridge, 11, 7);
    });

    this.drawLineCells(leftStart, leftEnd, this.simulation.bridgeChannels[0], 15, 9);
    this.drawLineCells(rightStart, rightEnd, this.simulation.bridgeChannels[1], 15, 9);
    this.simulation.wells.forEach((well, index) => this.drawWell(wells[index], radius, well, 0.82));
    this.context.restore();
  }

  drawBridgeChamber(startX, endX, y) {
    const ctx = this.context;
    const middle = (startX + endX) / 2;
    const shoulder = Math.min(82, (endX - startX) * 0.23);
    const halfHeight = 13;
    ctx.beginPath();
    ctx.moveTo(startX, y - 5);
    ctx.lineTo(middle - shoulder, y - 5);
    ctx.lineTo(middle - shoulder + 16, y - halfHeight);
    ctx.lineTo(middle + shoulder - 16, y - halfHeight);
    ctx.lineTo(middle + shoulder, y - 5);
    ctx.lineTo(endX, y - 5);
    ctx.lineTo(endX, y + 5);
    ctx.lineTo(middle + shoulder, y + 5);
    ctx.lineTo(middle + shoulder - 16, y + halfHeight);
    ctx.lineTo(middle - shoulder + 16, y + halfHeight);
    ctx.lineTo(middle - shoulder, y + 5);
    ctx.lineTo(startX, y + 5);
    ctx.closePath();
    ctx.fillStyle = 'rgba(132,174,202,.24)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(87,113,130,.42)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  drawPlate(x, y, width, height) {
    const ctx = this.context;
    ctx.shadowColor = 'rgba(26,34,37,.22)';
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 16;
    this.roundedRectangle(x, y + 13, width, height, 10, 'rgba(151,165,164,.22)', 'rgba(105,119,119,.34)');
    ctx.shadowColor = 'transparent';

    const plate = ctx.createLinearGradient(x, y, x + width, y + height);
    plate.addColorStop(0, 'rgba(255,255,255,.64)');
    plate.addColorStop(0.5, 'rgba(225,234,231,.25)');
    plate.addColorStop(1, 'rgba(255,255,255,.48)');
    this.roundedRectangle(x, y, width, height, 10, plate, 'rgba(128,141,140,.48)');
  }

  drawLineCells(start, end, cells, baseWidth, fluidWidth) {
    const ctx = this.context;
    const totalLength = Math.hypot(end.x - start.x, end.y - start.y);
    const pointAtDistance = (distance) => {
      const ratio = totalLength === 0 ? 0 : Math.max(0, Math.min(1, distance / totalLength));
      return {
        x: start.x + (end.x - start.x) * ratio,
        y: start.y + (end.y - start.y) * ratio
      };
    };

    ctx.lineCap = 'round';
    ctx.lineWidth = baseWidth;
    ctx.strokeStyle = 'rgba(91,98,98,.22)';
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    // Butt caps join adjacent concentration cells without producing colored
    // beads or overlap stripes at the advancing fluid front.
    ctx.lineCap = 'butt';
    for (let i = 0; i < cells.length - 1; i += 1) {
      const t = i / (cells.length - 1);
      const nextT = (i + 1) / (cells.length - 1);
      ctx.lineWidth = fluidWidth;
      ctx.strokeStyle = this.mixtureColor(cells[i]);
      ctx.beginPath();
      ctx.moveTo(start.x + (end.x - start.x) * t, start.y + (end.y - start.y) * t);
      ctx.lineTo(start.x + (end.x - start.x) * nextT, start.y + (end.y - start.y) * nextT);
      ctx.stroke();
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,.4)';
    ctx.beginPath();
    ctx.moveTo(start.x, start.y - 3);
    ctx.lineTo(end.x, end.y - 3);
    ctx.stroke();
    this.drawFlowParticles([start, end], cells, totalLength, pointAtDistance, fluidWidth);
    ctx.lineCap = 'round';
  }

  drawWell(position, radius, well, scale = 1) {
    const ctx = this.context;
    const r = radius * scale;
    const depth = 18;
    const radiusY = r * 0.78;
    const fluidY = position.y + depth * (1.65 - 1.7 * well.level);
    const body = ctx.createLinearGradient(position.x - r, position.y, position.x + r, position.y);
    body.addColorStop(0, 'rgba(188,198,197,.5)');
    body.addColorStop(0.3, 'rgba(255,255,255,.56)');
    body.addColorStop(0.72, 'rgba(218,227,226,.2)');
    body.addColorStop(1, 'rgba(141,153,153,.48)');

    ctx.beginPath();
    ctx.moveTo(position.x - r, position.y - depth);
    ctx.lineTo(position.x - r, position.y + depth);
    ctx.ellipse(position.x, position.y + depth, r, radiusY, 0, Math.PI, 0, true);
    ctx.lineTo(position.x + r, position.y - depth);
    ctx.closePath();
    ctx.fillStyle = body;
    ctx.fill();
    ctx.strokeStyle = 'rgba(99,112,112,.64)';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    this.ellipse(position.x, position.y - depth, r, radiusY, 'rgba(246,248,246,.68)', 'rgba(92,107,107,.65)', 1.5);
    this.ellipse(position.x, position.y - depth, r * 0.72, radiusY * 0.72, 'rgba(52,62,62,.14)', 'rgba(92,107,107,.58)');
    this.ellipse(position.x, fluidY - depth, r * 0.69, radiusY * 0.69, this.mixtureColor(well.mixture, 0.96), 'rgba(255,255,255,.4)');

    if (well.mixture.a > 0.01) {
      const shine = ctx.createRadialGradient(position.x - r * 0.25, fluidY - depth - radiusY * 0.2, 1, position.x, fluidY - depth, r * 0.7);
      shine.addColorStop(0, 'rgba(255,255,255,.55)');
      shine.addColorStop(0.35, 'rgba(255,255,255,.08)');
      shine.addColorStop(1, 'rgba(0,0,0,.18)');
      this.ellipse(position.x, fluidY - depth, r * 0.68, radiusY * 0.68, shine);
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = '#303639';
    ctx.font = '600 10px Inter, sans-serif';
    ctx.fillText(well.name, position.x, position.y + r + 40);
  }

  ellipse(x, y, radiusX, radiusY, fill, stroke = null, lineWidth = 1) {
    const ctx = this.context;
    ctx.beginPath();
    ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
  }

  roundedRectangle(x, y, width, height, radius, fill, stroke) {
    const ctx = this.context;
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
  }
}
