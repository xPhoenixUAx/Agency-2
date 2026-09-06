const motifs = [
  ['brands/google-ads.png', '#4285f4'],
  ['brands/youtube-ads.png', '#ea4335'],
  ['brands/google-analytics.png', '#fbbc05'],
  ['brands/google-tag-manager.png', '#4285f4'],
  ['brands/merchant-center.png', '#4285f4'],
  ['brands/looker-studio.png', '#4285f4'],
  ['brands/search-console.png', '#34a853'],
  ['brands/google-sheets.png', '#34a853'],
  ['brands/firebase.png', '#fbbc05'],
  ['brands/google-cloud.png', '#4285f4'],
  ['brands/gmail.png', '#ea4335'],
  ['icon-search.webp', '#4285f4'],
  ['icon-chart.webp', '#fbbc05'],
  ['icon-cart.webp', '#34a853'],
  ['icon-target.webp', '#34a853'],
  ['icon-gear.webp', '#fbbc05'],
  ['icon-report.webp', '#4285f4'],
  ['icon-bell.webp', '#ea4335'],
  ['icon-cursor.webp', '#4285f4'],
  ['icon-video.webp', '#ea4335'],
  ['icon-mobile.webp', '#4285f4'],
  ['icon-contact.webp', '#34a853'],
  ['icon-group.webp', '#ea4335'],
  ['icon-bag.webp', '#fbbc05'],
  ['icon-sale.webp', '#34a853'],
  ['icon-link.webp', '#4285f4'],
  ['icon-document.webp', '#4285f4'],
  ['icon-browser.webp', '#4285f4'],
  ['icon-phone.webp', '#34a853'],
  ['icon-spark.webp', '#fbbc05'],
  ['icon-idea.webp', '#fbbc05'],
  ['icon-bulb.webp', '#fbbc05'],
  ['icon-building.webp', '#fbbc05'],
  ['icon-warning.webp', '#fbbc05'],
];
const shuffle = (items) => {
  const deck = [...items];
  for (let index = deck.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [deck[index], deck[other]] = [deck[other], deck[index]];
  }
  return deck;
};
// Introduce the core products first, then show the entire set before repeating.
const motifDeck = [
  ...shuffle(motifs.slice(0, 3)),
  ...shuffle(motifs.slice(3, 6)),
  ...shuffle(motifs.slice(6)),
];
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
let physicsLoader;
let savedPile;

function loadPhysics() {
  if (window.Matter) return Promise.resolve(window.Matter);
  if (!physicsLoader) {
    physicsLoader = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = new URL('./vendor/matter.js', import.meta.url).href;
      script.onload = () => {
        script.remove();
        resolve(window.Matter);
      };
      script.onerror = () => {
        script.remove();
        physicsLoader = null;
        reject(new Error('Side decoration physics could not load.'));
      };
      document.head.append(script);
    });
  }
  return physicsLoader;
}

export function initScrollDecor(signal, allowed) {
  const section = document.querySelector('.page-home main > section:nth-of-type(2)');
  const container = section?.querySelector('.container');
  if (!container || !allowed()) return;
  const header = document.querySelector('.site-header');
  const footer = document.querySelector('body > footer');
  const layer = document.createElement('div');
  layer.className = 'scroll-decor';
  layer.setAttribute('aria-hidden', 'true');
  layer.inert = true;
  document.body.append(layer);

  let physics;
  let engine;
  let loading = false;
  let failed = false;
  let walls = [];
  const balls = [];
  let geometry;
  let worldGeometry;
  let frame = 0;
  let previousTime = 0;
  let accumulator = 0;
  let nextDrop = 0;
  let furthest = savedPile?.furthest || 0;
  let needsMeasure = true;
  const timestep = 1000 / 120;

  const measure = () => {
    const bounds = container.getBoundingClientRect();
    const top = header?.offsetHeight || 0;
    const gutter = Math.min(bounds.left, document.documentElement.clientWidth - bounds.right);
    const diameter = clamp(gutter - 32, 40, 64);
    const height = Math.max(1, innerHeight - top);
    geometry = {
      top,
      height,
      gutter,
      diameter,
      capacity: clamp(
        Math.floor((gutter - 16) / diameter) * Math.floor((height * 0.4) / diameter) * 2,
        6,
        36,
      ),
      width: document.documentElement.clientWidth,
      start: section.getBoundingClientRect().top + scrollY - top,
      end: footer ? footer.getBoundingClientRect().top + scrollY : document.body.scrollHeight,
    };
    layer.style.top = `${top}px`;
    needsMeasure = false;
  };

  const draw = () => {
    for (const { body, element, radius } of balls) {
      const { x, y } = body.position;
      element.style.transform = `translate3d(${(x - radius).toFixed(2)}px, ${(y - radius).toFixed(2)}px, 0) rotate(${body.angle.toFixed(4)}rad)`;
    }
  };

  const syncWalls = (floor) => {
    const { width, gutter, height, diameter } = geometry;
    if (
      worldGeometry?.width === width &&
      worldGeometry?.floor === floor &&
      worldGeometry?.gutter === gutter
    )
      return;
    const { Bodies, Body, Composite, Sleeping } = physics;
    while (balls.length > geometry.capacity) {
      const ball = balls.pop();
      Composite.remove(engine.world, ball.body);
      ball.element.remove();
    }
    if (worldGeometry) {
      for (const ball of balls) {
        const oldOrigin = ball.side ? worldGeometry.width - worldGeometry.gutter : 0;
        const origin = ball.side ? width - gutter : 0;
        const fraction = (ball.body.position.x - oldOrigin) / worldGeometry.gutter;
        const radius = (diameter * ball.scale) / 2;
        Body.scale(ball.body, radius / ball.radius, radius / ball.radius);
        ball.radius = radius;
        ball.element.style.width = `${radius * 2}px`;
        ball.element.style.height = `${radius * 2}px`;
        Body.setPosition(ball.body, {
          x: origin + clamp(fraction * gutter, radius + 10, gutter - radius - 10),
          y: Math.min(ball.body.position.y + floor - worldGeometry.floor, floor - radius),
        });
        Sleeping.set(ball.body, false);
      }
    }
    Composite.remove(engine.world, walls);
    walls = [];
    for (const origin of [0, width - gutter]) {
      const material = { isStatic: true, friction: 0.3, restitution: 0.25 };
      walls.push(
        Bodies.rectangle(origin - 40, height / 2 - 500, 96, height + 3000, material),
        Bodies.rectangle(origin + gutter + 40, height / 2 - 500, 96, height + 3000, material),
        Bodies.rectangle(origin + gutter / 2, floor + 100, gutter + 100, 200, material),
      );
    }
    Composite.add(engine.world, walls);
    worldGeometry = { width, gutter, floor };
  };

  const addBall = (index, restored) => {
    const { Bodies, Body, Composite } = physics;
    const side = index % 2;
    const scale = 0.86 + (index % 3) * 0.07;
    const radius = (geometry.diameter * scale) / 2;
    const origin = side ? geometry.width - geometry.gutter : 0;
    const fraction = restored?.fraction ?? 0.22 + ((index * 0.618034) % 1) * 0.56;
    const x =
      origin + clamp(fraction * geometry.gutter, radius + 12, geometry.gutter - radius - 12);
    const y = restored ? worldGeometry.floor - restored.fromFloor : -radius - 12;
    const body = Bodies.circle(x, Math.min(y, worldGeometry.floor - radius), radius, {
      restitution: 0.48,
      friction: 0.16,
      frictionStatic: 0.55,
      frictionAir: 0.006,
      density: 0.001,
      sleepThreshold: 75,
    });
    Body.setAngle(body, restored?.angle ?? Math.sin(index * 2.4) * 0.4);
    Body.setVelocity(body, restored?.velocity ?? { x: Math.sin(index * 2.1 + 0.7) * 1.1, y: 0.5 });
    Body.setAngularVelocity(body, restored?.angularVelocity ?? Math.sin(index + 1) * 0.025);
    // Shift the next pass by one so logos are not tied to the same side forever.
    const [asset, tint] =
      motifDeck[(index + Math.floor(index / motifDeck.length)) % motifDeck.length];
    const element = document.createElement('span');
    element.className = 'scroll-decor-ball';
    if (asset.startsWith('brands/')) element.classList.add('scroll-decor-ball--brand');
    element.style.width = `${radius * 2}px`;
    element.style.height = `${radius * 2}px`;
    element.style.setProperty('--ball-tint', tint);
    const image = document.createElement('img');
    image.src = new URL(`../assets/images/${asset}`, import.meta.url).href;
    image.alt = '';
    image.width = 80;
    image.height = 80;
    image.draggable = false;
    element.append(image);
    layer.append(element);
    balls.push({ body, element, radius, scale, side });
    Composite.add(engine.world, body);
  };

  const startPhysics = () => {
    if (loading || failed) return;
    loading = true;
    loadPhysics()
      .then((module) => {
        if (signal.aborted || !allowed()) return;
        physics = module;
        engine = physics.Engine.create({
          enableSleeping: true,
          positionIterations: 8,
          velocityIterations: 8,
        });
        engine.gravity.y = 0.75;
        syncWalls(
          Math.max(80, Math.min(geometry.height, geometry.end - scrollY - geometry.top) - 16),
        );
        if (savedPile) {
          savedPile.balls
            .slice(0, geometry.capacity)
            .forEach((ball, index) => addBall(index, ball));
        }
        draw();
        schedule();
      })
      .catch(() => {
        failed = true;
        layer.dataset.active = 'false';
      });
  };

  const update = (time) => {
    frame = 0;
    if (!allowed() || signal.aborted) return;
    if (needsMeasure) measure();
    const visibleHeight = clamp(geometry.end - scrollY - geometry.top, 0, geometry.height);
    const visible = geometry.gutter >= 72 && scrollY >= geometry.start && visibleHeight >= 100;
    layer.dataset.active = String(visible && !failed);
    if (!visible) {
      accumulator = 0;
      return;
    }
    layer.style.height = `${visibleHeight}px`;
    if (!engine) {
      startPhysics();
      return;
    }
    syncWalls(visibleHeight - 16);
    furthest = Math.max(furthest, scrollY - geometry.start);
    const spacing = Math.max(
      150,
      ((geometry.end - geometry.start - geometry.height) * 0.85) / geometry.capacity,
    );
    const wanted = Math.min(geometry.capacity, 2 + Math.floor(furthest / spacing));
    if (balls.length < wanted && time >= nextDrop) {
      addBall(balls.length);
      nextDrop = time + 260;
    }
    accumulator += Math.min(time - previousTime, 50);
    previousTime = time;
    while (accumulator >= timestep) {
      physics.Engine.update(engine, timestep);
      accumulator -= timestep;
    }
    draw();
    if (balls.length < wanted || balls.some(({ body }) => !body.isSleeping)) {
      frame = requestAnimationFrame(update);
    }
  };
  const schedule = () => {
    if (!frame) {
      previousTime = performance.now();
      frame = requestAnimationFrame(update);
    }
  };
  const resize = () => {
    needsMeasure = true;
    schedule();
  };
  window.addEventListener('scroll', schedule, { passive: true, signal });
  window.addEventListener('resize', resize, { passive: true, signal });
  const observer = new ResizeObserver(resize);
  observer.observe(document.querySelector('main'));
  if (header) observer.observe(header);
  signal.addEventListener(
    'abort',
    () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      if (engine) {
        savedPile = {
          furthest,
          balls: balls.map(({ body, side }) => ({
            fraction:
              (body.position.x - (side ? worldGeometry.width - worldGeometry.gutter : 0)) /
              worldGeometry.gutter,
            fromFloor: worldGeometry.floor - body.position.y,
            angle: body.angle,
            velocity: { ...body.velocity },
            angularVelocity: body.angularVelocity,
          })),
        };
        physics.Composite.clear(engine.world, false);
        physics.Engine.clear(engine);
      }
      layer.remove();
    },
    { once: true },
  );
  measure();
  schedule();
}
