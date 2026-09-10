import { getAdjacentProject, getProjectBySlug } from "./content.mjs";

export function getAdjacentDrawingIndex(currentIndex, total, direction) {
  if (!Number.isInteger(total) || total <= 0) {
    return 0;
  }

  return (currentIndex + direction + total) % total;
}

export function revealCurrentThumbnail(thumbnail) {
  thumbnail?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
}

export function resolveProjectSlug(search, explicitSlug) {
  return explicitSlug || new URLSearchParams(search).get("slug");
}

export function initializeDrawingViewer(root, drawings) {
  const dialog = root?.querySelector?.("[data-drawing-dialog]");
  if (!dialog || !Array.isArray(drawings) || drawings.length === 0) {
    return false;
  }

  const ownerDocument = dialog.ownerDocument ?? document;
  const image = dialog.querySelector("[data-drawing-image]");
  const label = dialog.querySelector("[data-drawing-label]");
  const group = dialog.querySelector("[data-drawing-group]");
  const count = dialog.querySelector("[data-drawing-count]");
  const error = dialog.querySelector("[data-drawing-error]");
  const zoomButton = dialog.querySelector("[data-drawing-zoom]");
  const closeButton = dialog.querySelector("[data-drawing-close]");
  const thumbnailButtons = [...dialog.querySelectorAll("[data-drawing-select]")];
  let currentIndex = 0;
  let lastTrigger = null;

  const resetZoom = () => {
    dialog.classList.remove("is-zoomed");
    zoomButton?.setAttribute("aria-pressed", "false");
    if (zoomButton) {
      zoomButton.setAttribute("aria-label", "放大图纸");
    }
  };

  const showDrawing = (requestedIndex) => {
    currentIndex = getAdjacentDrawingIndex(requestedIndex, drawings.length, 0);
    const drawing = drawings[currentIndex];

    dialog.classList.add("is-loading");
    resetZoom();
    error?.setAttribute("hidden", "");

    if (image) {
      image.src = drawing.src;
      image.alt = drawing.alt;
      image.width = drawing.width;
      image.height = drawing.height;
    }
    if (label) label.textContent = drawing.label;
    if (group) group.textContent = `${drawing.group} / PDF 第 ${drawing.pdfPage} 页`;
    if (count) count.textContent = `第 ${currentIndex + 1} 张，共 ${drawings.length} 张`;

    thumbnailButtons.forEach((button, index) => {
      if (index === currentIndex) {
        button.setAttribute("aria-current", "true");
      } else {
        button.removeAttribute("aria-current");
      }
    });
    revealCurrentThumbnail(thumbnailButtons[currentIndex]);
  };

  const openViewer = (requestedIndex, trigger) => {
    lastTrigger = trigger;
    showDrawing(requestedIndex);

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
      dialog.classList.add("drawing-dialog-fallback");
    }

    ownerDocument.body?.classList.add("has-open-drawing-viewer");
    closeButton?.focus?.();
  };

  const closeViewer = () => {
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
      dialog.classList.remove("drawing-dialog-fallback");
    }

    ownerDocument.body?.classList.remove("has-open-drawing-viewer");
    resetZoom();
    lastTrigger?.focus?.();
  };

  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const opener = target.closest("[data-drawing-open]");
    if (opener) {
      openViewer(Number.parseInt(opener.dataset.drawingOpen ?? "0", 10), opener);
      return;
    }

    const selector = target.closest("[data-drawing-select]");
    if (selector) {
      showDrawing(Number.parseInt(selector.dataset.drawingSelect ?? "0", 10));
      return;
    }

    if (target.closest("[data-drawing-previous]")) {
      showDrawing(getAdjacentDrawingIndex(currentIndex, drawings.length, -1));
      return;
    }

    if (target.closest("[data-drawing-next]")) {
      showDrawing(getAdjacentDrawingIndex(currentIndex, drawings.length, 1));
      return;
    }

    if (target.closest("[data-drawing-close]")) {
      closeViewer();
      return;
    }

    if (target.closest("[data-drawing-zoom]")) {
      const zoomed = dialog.classList.toggle("is-zoomed");
      zoomButton?.setAttribute("aria-pressed", String(zoomed));
      zoomButton?.setAttribute("aria-label", zoomed ? "适应屏幕" : "放大图纸");
    }
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeViewer();
  });

  dialog.addEventListener("close", () => {
    ownerDocument.body?.classList.remove("has-open-drawing-viewer");
    resetZoom();
  });

  image?.addEventListener("load", () => dialog.classList.remove("is-loading"));
  image?.addEventListener("error", () => {
    dialog.classList.remove("is-loading");
    error?.removeAttribute("hidden");
  });

  ownerDocument.addEventListener("keydown", (event) => {
    if (!dialog.hasAttribute("open")) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showDrawing(getAdjacentDrawingIndex(currentIndex, drawings.length, -1));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showDrawing(getAdjacentDrawingIndex(currentIndex, drawings.length, 1));
    } else if (event.key === "Escape" && dialog.classList.contains("drawing-dialog-fallback")) {
      event.preventDefault();
      closeViewer();
    }
  });

  return true;
}

const main = document.querySelector("#project-main");
const slug = resolveProjectSlug(window.location.search, document.body?.dataset?.projectSlug);
const project = getProjectBySlug(slug);
const nextProject = getAdjacentProject(slug);

if (!main) {
  throw new Error("Project main landmark is missing");
}

if (!project) {
  document.title = "项目未找到 | 徐楷峰";
  main.innerHTML = `
    <section class="project-fallback project-error">
      <h1>项目未找到</h1>
      <p>这个链接可能已经失效，请返回作品列表继续浏览。</p>
      <a class="text-link" href="index.html#work">返回作品</a>
    </section>
  `;
} else if (project.caseStudyUrl) {
  window.location.replace(project.caseStudyUrl);
} else {
  const supportingMedia = project.mediaSlots.slice(1);
  const processItems = project.process
    .map(
      (step) => `
        <li class="case-process-item">
          <span>${step}</span>
        </li>
      `,
    )
    .join("");
  const evidenceFigures = supportingMedia
    .map(
      (media) => `
        <figure class="case-asset case-asset--${media.kind}">
          <img
            src="${media.src}"
            alt="${media.alt}"
            width="${media.width}"
            height="${media.height}"
            loading="lazy"
          />
          <figcaption>
            <strong>${media.label}</strong>
            <span>${media.caption}</span>
          </figcaption>
        </figure>
      `,
    )
    .join("");
  const drawings = Array.isArray(project.drawings) ? project.drawings : [];
  const drawingGroups = ["楼层平面", "公区立面", "客房深化"]
    .map((groupName) => ({
      name: groupName,
      count: drawings.filter((drawing) => drawing.group === groupName).length,
    }))
    .filter(({ count }) => count > 0);
  const drawingDelivery = drawings.length
    ? `
      <section class="drawing-delivery" aria-labelledby="drawing-delivery-title">
        <header class="drawing-delivery-heading">
          <p>图纸交付</p>
          <h2 id="drawing-delivery-title">把标准落实到一整套图纸。</h2>
          <span>以下展示 PDF 第 32-53 页，仅保留个人参与完成的 CAD 成果。</span>
        </header>

        <dl class="drawing-groups" aria-label="图纸构成">
          ${drawingGroups
            .map(
              ({ name, count }) => `
                <div>
                  <dt>${name}</dt>
                  <dd>${count} 张</dd>
                </div>
              `,
            )
            .join("")}
        </dl>

        <div class="drawing-featured">
          ${[0, 12, 14]
            .map((index) => {
              const drawing = drawings[index];
              return `
                <button type="button" class="drawing-preview" data-drawing-open="${index}" aria-haspopup="dialog">
                  <img src="${drawing.src}" alt="${drawing.alt}" width="${drawing.width}" height="${drawing.height}" loading="lazy" />
                  <span><strong>${drawing.label}</strong><small>${drawing.group}</small></span>
                </button>
              `;
            })
            .join("")}
        </div>

        <button class="drawing-viewer-button" type="button" data-drawing-open="0" aria-haspopup="dialog">
          查看全套 22 张图纸
        </button>
      </section>

      <dialog class="drawing-dialog" data-drawing-dialog aria-labelledby="drawing-dialog-title">
        <div class="drawing-dialog-shell">
          <header class="drawing-dialog-header">
            <div>
              <p>你好酒店 2.0 / 图纸交付</p>
              <h2 id="drawing-dialog-title" data-drawing-label>${drawings[0].label}</h2>
            </div>
            <button type="button" class="drawing-dialog-close" data-drawing-close>关闭</button>
          </header>

          <div class="drawing-dialog-stage">
            <button type="button" class="drawing-dialog-nav drawing-dialog-previous" data-drawing-previous aria-label="上一张图纸">上一张</button>
            <div class="drawing-canvas">
              <button type="button" class="drawing-zoom" data-drawing-zoom aria-label="放大图纸" aria-pressed="false">
                <img data-drawing-image src="${drawings[0].src}" alt="${drawings[0].alt}" width="${drawings[0].width}" height="${drawings[0].height}" />
              </button>
              <p class="drawing-load-error" data-drawing-error hidden>这张图纸暂时无法载入，请切换到其他图纸后重试。</p>
            </div>
            <button type="button" class="drawing-dialog-nav drawing-dialog-next" data-drawing-next aria-label="下一张图纸">下一张</button>
          </div>

          <footer class="drawing-dialog-footer">
            <div class="drawing-dialog-meta">
              <span data-drawing-group>${drawings[0].group} / PDF 第 ${drawings[0].pdfPage} 页</span>
              <output data-drawing-count aria-live="polite" aria-atomic="true">第 1 张，共 ${drawings.length} 张</output>
            </div>
            <div class="drawing-thumbnails" aria-label="全部图纸缩略图">
              ${drawings
                .map(
                  (drawing, index) => `
                    <button type="button" class="drawing-thumb" data-drawing-select="${index}" aria-label="查看${drawing.label}"${index === 0 ? ' aria-current="true"' : ""}>
                      <img src="${drawing.thumbnail}" alt="" width="480" height="270" loading="lazy" />
                      <span>${index + 1}</span>
                    </button>
                  `,
                )
                .join("")}
            </div>
          </footer>
        </div>
      </dialog>
    `
    : "";

  document.title = `${project.title} | 徐楷峰`;
  main.innerHTML = `
    <article class="case-study">
      <header class="case-header">
        <p class="case-category">${project.stage} / ${project.category}</p>
        <h1>${project.headline}</h1>
        <p class="case-concept">${project.concept}</p>
        <dl class="case-meta">
          <div>
            <dt>项目性质</dt>
            <dd>${project.status} · ${project.year}</dd>
          </div>
          <div>
            <dt>个人职责</dt>
            <dd>${project.role}</dd>
          </div>
        </dl>
      </header>

      <figure class="case-image">
        <img
          src="${project.image}"
          alt="${project.alt}"
          width="${project.imageWidth}"
          height="${project.imageHeight}"
        />
        <figcaption>${project.assetNote}</figcaption>
      </figure>

      <section class="case-summary" aria-label="项目摘要">
        <p>${project.summary}</p>
      </section>

      <div class="case-narrative">
        <section class="case-position">
          <h2>设计立场</h2>
          <p>${project.statement}</p>
        </section>
        <section class="case-challenge">
          <h2>需要回应的问题</h2>
          <p>${project.challenge}</p>
        </section>
        <section class="case-approach">
          <h2>空间策略</h2>
          <p>${project.approach}</p>
        </section>
      </div>

      <section class="case-process" aria-labelledby="case-process-title">
        <div class="case-process-heading">
          <p>从判断到表达</p>
          <h2 id="case-process-title">项目是这样被推进的。</h2>
        </div>
        <ol class="case-process-list">
          ${processItems}
        </ol>
      </section>

      <section class="case-assets" aria-labelledby="case-assets-title">
        <header class="case-assets-heading">
          <h2 id="case-assets-title">把过程展开来看。</h2>
          <p>从整体关系到图纸、材料与最终空间，每一张图都对应一次具体判断。</p>
        </header>
        <div class="case-assets-grid">
          ${evidenceFigures}
        </div>
      </section>

      ${drawingDelivery}

      <footer class="case-footer">
        <div class="case-footer-actions">
          <a class="text-link" href="index.html#work">返回作品</a>
          <button class="contact-button" type="button" aria-haspopup="dialog" data-contact-open>联系</button>
        </div>
        <a class="case-next-project" href="${nextProject?.caseStudyUrl ?? `${nextProject?.slug}.html`}">
          <span>下一个项目</span>
          <strong>${nextProject?.title ?? "返回作品列表"} <span aria-hidden="true">→</span></strong>
        </a>
      </footer>
    </article>
  `;

  initializeDrawingViewer(main, drawings);
}
