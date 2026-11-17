const PRODUCTS = [
  {
    id: "repair",
    name: "마데카소사이드 흔적리페어 10+1매",
    image: "./public/assets/product-01.png",
    price: "10,000원",
    sale: "50%",
    state: "today",
    status: "오늘드림 가능",
    cta: "선택",
  },
  {
    id: "rose-set",
    name: "로제 PDRN 모공결광 10+1매",
    image: "./public/assets/product-02.png",
    price: "10,000원",
    sale: "50%",
    state: "today",
    status: "오늘드림 가능",
    cta: "선택",
  },
  {
    id: "rose",
    name: "로제 PDRN 모공결광 10매",
    image: "./public/assets/product-03.png",
    price: "10,000원",
    sale: "50%",
    state: "shipping",
    status: "오늘드림 품절",
    subStatus: "일반배송 가능",
    cta: "일반배송",
  },
  {
    id: "collagen",
    name: "콜라겐 코어탄력 10매",
    image: "./public/assets/product-04.png",
    price: "10,000원",
    sale: "50%",
    state: "pickup",
    status: "오늘드림 품절",
    subStatus: "픽업 가능",
    cta: "픽업 확인",
  },
  {
    id: "teatree",
    name: "티트리 진정수분 10매",
    image: "./public/assets/product-05.png",
    price: "10,000원",
    sale: "50%",
    state: "both",
    status: "오늘드림 품절",
    subStatus: "일반배송·픽업 가능",
    cta: "수령 방법 확인",
  },
  {
    id: "watermide",
    name: "워터마이드 수분 보습 에센셜 마스크 10매",
    image: "./public/assets/product-01.png",
    price: "10,000원",
    sale: "50%",
    state: "soldout",
    status: "전체 품절",
    subStatus: "구매 가능한 수령 방법 없음",
    cta: "재입고 알림",
  },
  {
    id: "vita",
    name: "비타 라이트닝 버블 에센셜 마스크 10매",
    image: "./public/assets/product-02.png",
    price: "10,000원",
    sale: "50%",
    state: "unknown",
    status: "오늘드림 품절",
    subStatus: "다른 재고 확인 필요",
    cta: "구매 방법 확인",
  },
  {
    id: "nude",
    name: "누드겔 데일리 톤업 마스크 10매",
    image: "./public/assets/product-03.png",
    price: "10,000원",
    sale: "50%",
    state: "today",
    status: "오늘드림 가능",
    cta: "선택",
  },
];

const STORES = [
  { id: "gangnam", name: "올리브영 강남타운점", distance: "0.4km", stock: "재고 3개", time: "오후 4:20부터 픽업" },
  { id: "station", name: "올리브영 강남역점", distance: "0.7km", stock: "재고 1개", time: "오후 4:40부터 픽업" },
  { id: "sinsawon", name: "올리브영 신논현역점", distance: "0.9km", stock: "재고 5개", time: "오후 4:30부터 픽업" },
];

const state = {
  screen: "list",
  previousScreen: "list",
  selectedProduct: PRODUCTS[4],
  selectedMethod: "shipping",
  selectedStore: STORES[0],
  alertScope: "today",
  alertDone: false,
  unknownFailedOnce: false,
  listScrollTop: 0,
  stockChanged: false,
  stockDepletionShown: false,
  orderComplete: false,
};

const screen = document.querySelector("#screen");
const toast = document.querySelector("#toast");
const headerTitle = document.querySelector("#appHeaderTitle");

function selectedProductHTML(product = state.selectedProduct) {
  return `
    <div class="selected-product">
      <img src="${product.image}" alt="${product.name} 상품 이미지" />
      <div>
        <strong>${product.name}</strong>
        <span>${product.price} · ${product.status}</span>
      </div>
    </div>
  `;
}

function screenHead(title, { back = true, close = true } = {}) {
  if (!back) {
    return `
      <div class="screen-head no-back">
        <h2>${title}</h2>
        ${close ? '<button class="screen-close" type="button" data-action="close" aria-label="닫기">×</button>' : ""}
      </div>
    `;
  }
  return `
    <div class="screen-head">
      <button class="screen-back" type="button" data-action="back" aria-label="이전">‹</button>
      <h2>${title}</h2>
      ${close ? '<button class="screen-close" type="button" data-action="close" aria-label="닫기">×</button>' : "<span></span>"}
    </div>
  `;
}

function renderList() {
  headerTitle.textContent = "상품 상세";
  const rows = PRODUCTS.map((product) => {
    const today = product.state === "today";
    const statusClass = today ? "today" : "sold-out";
    const primaryClass = today ? "primary" : "";
    return `
      <li class="option-row" data-product-row="${product.id}">
        <img class="option-thumb" src="${product.image}" alt="" />
        <div class="option-copy">
          <span class="option-name">${product.name}</span>
          <span class="option-price"><b class="sale">${product.sale}</b><b>${product.price}</b></span>
          <span class="stock-line ${statusClass}">${product.status}${product.subStatus ? ` · ${product.subStatus}` : ""}</span>
        </div>
        <div class="row-actions">
          <button class="compact-button ${primaryClass}" type="button" data-product-action="${product.id}">${product.cta}</button>
          ${today || product.state === "soldout" ? "" : `<button class="compact-link" type="button" data-restock="${product.id}">오늘드림 재입고</button>`}
        </div>
      </li>
    `;
  }).join("");

  screen.innerHTML = `
    ${screenHead("옵션을 선택해 주세요", { back: false })}
    <div class="screen-body" id="optionScroll">
      <div class="list-intro"><span>재고 상태에 맞는 구매 방법을 보여드려요.</span><strong>8개</strong></div>
      <ul class="option-list">${rows}</ul>
    </div>
  `;

  const optionScroll = document.querySelector("#optionScroll");
  optionScroll.scrollTop = state.listScrollTop;
  optionScroll.addEventListener("scroll", () => {
    state.listScrollTop = optionScroll.scrollTop;
  }, { passive: true });
}

function methodAvailability(product) {
  if (product.state === "shipping") return { shipping: true, pickup: false };
  if (product.state === "pickup") return { shipping: false, pickup: true };
  return { shipping: true, pickup: true };
}

function renderMethods() {
  headerTitle.textContent = "다른 수령 방법";
  const availability = methodAvailability(state.selectedProduct);
  if (!availability[state.selectedMethod]) {
    state.selectedMethod = availability.shipping ? "shipping" : "pickup";
  }
  screen.innerHTML = `
    ${screenHead("다른 수령 방법")}
    <div class="screen-body">
      ${selectedProductHTML()}
      <div class="section-copy">
        <h3>수령 방법을 선택해 주세요</h3>
        <p>오늘드림은 품절이지만 다른 방법으로 구매할 수 있어요.</p>
      </div>
      <div class="method-list">
        <button class="method-option disabled" type="button" disabled>
          <span class="radio-mark"></span>
          <span class="method-main">
            <span class="method-title">오늘드림 <span class="status-label">품절</span></span>
            <span class="method-meta">오늘 받기 어려워요.</span>
          </span>
        </button>
        <button class="method-option ${state.selectedMethod === "shipping" ? "selected" : ""} ${availability.shipping ? "" : "disabled"}" type="button" data-method="shipping" ${availability.shipping ? "" : "disabled"}>
          <span class="radio-mark"></span>
          <span class="method-main">
            <span class="method-title">일반배송 <span class="status-label">${availability.shipping ? "배송비 0원" : "품절"}</span></span>
            <span class="method-meta">${availability.shipping ? "내일 11/17 도착 예정" : "현재 구매할 수 없어요."}</span>
            ${availability.shipping ? '<span class="method-detail">2만원 이상 무료배송</span>' : ""}
          </span>
        </button>
        <button class="method-option ${state.selectedMethod === "pickup" ? "selected" : ""} ${availability.pickup ? "" : "disabled"}" type="button" data-method="pickup" ${availability.pickup ? "" : "disabled"}>
          <span class="radio-mark"></span>
          <span class="method-main">
            <span class="method-title">매장 픽업 <span class="status-label">${availability.pickup ? "주변 3개 매장" : "품절"}</span></span>
            <span class="method-meta">${availability.pickup ? "최소 1시간 후 픽업 가능" : "주변 매장에 재고가 없어요."}</span>
            ${availability.pickup ? '<span class="method-detail">픽업 매장에서 결제 완료 상품 수령</span>' : ""}
          </span>
        </button>
      </div>
      <div class="notice-panel">예상 수령 시간과 재고는 주문 완료 전 변경될 수 있어요.</div>
    </div>
    <div class="screen-footer button-stack">
      <button class="primary-button" type="button" data-action="continue-method">${state.selectedMethod === "pickup" ? "픽업 매장 선택" : "일반배송으로 구매"}</button>
      <button class="text-button" type="button" data-action="restock">오늘드림 재입고 알림</button>
    </div>
  `;
}

function renderPickup() {
  headerTitle.textContent = "픽업 매장 선택";
  const stores = STORES.map((store) => `
    <button class="store-option ${state.selectedStore.id === store.id ? "selected" : ""}" type="button" data-store="${store.id}">
      <span class="radio-mark"></span>
      <span class="store-main">
        <span class="store-title">${store.name}<span class="inventory">${store.stock}</span></span>
        <span class="store-meta">${store.distance} · ${store.time}</span>
      </span>
    </button>
  `).join("");
  screen.innerHTML = `
    ${screenHead("픽업 매장 선택")}
    <div class="screen-body">
      ${selectedProductHTML()}
      <div class="location-summary">
        <span><strong>현재 위치</strong><br />서울 강남구 강남대로</span>
        <button type="button" data-action="location">위치 변경</button>
      </div>
      <div class="section-copy">
        <h3>픽업 가능한 매장 3개</h3>
        <p>재고와 준비 시간을 확인하고 받을 매장을 선택해 주세요.</p>
      </div>
      <div class="store-list">${stores}</div>
    </div>
    <div class="screen-footer">
      <button class="primary-button" type="button" data-action="confirm-store">${state.selectedStore.name}에서 픽업</button>
    </div>
  `;
}

function renderRestock() {
  headerTitle.textContent = "재입고 알림";
  if (state.alertDone) {
    screen.innerHTML = `
      ${screenHead("재입고 알림")}
      <div class="screen-body">
        ${selectedProductHTML()}
        <div class="complete-state">
          <span class="complete-icon">✓</span>
          <h3>알림 신청 완료</h3>
          <p>${state.alertScope === "today" ? "오늘드림" : "모든 수령 방법"} 재고가 들어오면<br />앱 푸시로 알려드릴게요.</p>
        </div>
      </div>
      <div class="screen-footer">
        <button class="primary-button" type="button" data-action="back-list">옵션 목록으로</button>
      </div>
    `;
    return;
  }

  screen.innerHTML = `
    ${screenHead("재입고 알림 신청")}
    <div class="screen-body">
      ${selectedProductHTML()}
      <div class="alert-scope">
        <h3>어느 재고를 알려드릴까요?</h3>
        <div class="scope-options">
          <button class="scope-option ${state.alertScope === "today" ? "selected" : ""}" type="button" data-scope="today">
            <span class="radio-mark"></span>
            <span><strong>오늘드림 재고</strong><small>바로 받을 수 있을 때 알려드려요.</small></span>
          </button>
          <button class="scope-option ${state.alertScope === "all" ? "selected" : ""}" type="button" data-scope="all">
            <span class="radio-mark"></span>
            <span><strong>모든 수령 방법 재고</strong><small>일반배송과 픽업 재고도 함께 알려드려요.</small></span>
          </button>
        </div>
      </div>
      <div class="notice-panel">알림을 받아도 재고가 빠르게 소진될 수 있어요. 알림 자체는 구매 예약이 아닙니다.</div>
    </div>
    <div class="screen-footer">
      <button class="primary-button" type="button" data-action="submit-restock">재입고 알림 신청</button>
    </div>
  `;
}

function renderLoading() {
  headerTitle.textContent = "재고 확인";
  screen.innerHTML = `
    ${screenHead("다른 구매 방법 확인")}
    <div class="screen-body">
      ${selectedProductHTML()}
      <div class="loading-wrap">
        <div class="loading-bars" aria-hidden="true"><span></span><span></span><span></span></div>
        <p>일반배송과 주변 매장 재고를<br />확인하고 있어요.</p>
      </div>
    </div>
  `;

  window.setTimeout(() => {
    if (state.screen !== "loading") return;
    if (!state.unknownFailedOnce) {
      state.unknownFailedOnce = true;
      state.screen = "inventoryError";
    } else {
      state.selectedProduct = {
        ...state.selectedProduct,
        state: "both",
        subStatus: "일반배송·픽업 가능",
      };
      state.screen = "methods";
    }
    render();
  }, 900);
}

function renderInventoryError() {
  headerTitle.textContent = "재고 확인";
  screen.innerHTML = `
    ${screenHead("다른 구매 방법 확인")}
    <div class="screen-body">
      ${selectedProductHTML()}
      <div class="empty-state">
        <span class="complete-icon">!</span>
        <h3>재고를 확인하지 못했어요</h3>
        <p>일시적인 오류입니다.<br />잠시 후 다시 확인해 주세요.</p>
      </div>
    </div>
    <div class="screen-footer button-stack">
      <button class="primary-button" type="button" data-action="retry-inventory">다시 확인</button>
      <button class="text-button" type="button" data-action="restock">오늘드림 재입고 알림</button>
    </div>
  `;
}

function renderOrder() {
  headerTitle.textContent = "주문/결제";
  const pickup = state.selectedMethod === "pickup";

  if (state.orderComplete) {
    screen.innerHTML = `
      ${screenHead("주문 완료", { close: false })}
      <div class="screen-body">
        <div class="complete-state">
          <span class="complete-icon">✓</span>
          <h3>주문이 완료됐어요</h3>
          <p>${pickup ? `${state.selectedStore.name}에서<br />${state.selectedStore.time.replace("픽업", "받을 수 있어요")}.` : "일반배송으로 내일 11/17<br />도착할 예정이에요."}</p>
        </div>
      </div>
      <div class="screen-footer">
        <button class="primary-button" type="button" data-action="back-list">쇼핑 계속하기</button>
      </div>
    `;
    return;
  }

  screen.innerHTML = `
    ${screenHead("주문/결제")}
    <div class="screen-body">
      ${state.stockChanged ? `
        <div class="error-panel">
          <strong>선택한 매장의 재고가 방금 소진됐어요.</strong>
          옵션과 수령 방법은 그대로 유지됩니다. 다른 매장을 선택해 주세요.
        </div>
      ` : ""}
      <div class="order-block">
        <h3>수령 방법</h3>
        <div class="order-row"><span>${pickup ? "매장 픽업" : "일반배송"}</span><strong>${pickup ? state.selectedStore.name : "내일 11/17 도착 예정"}</strong></div>
        ${pickup ? `<div class="order-row"><span>픽업 시간</span><strong>${state.selectedStore.time}</strong></div>` : '<div class="order-row"><span>배송지</span><strong>서울 강남구 강남대로</strong></div>'}
      </div>
      <div class="order-block">
        <h3>주문 상품</h3>
        ${selectedProductHTML()}
        <div class="order-row"><span>수량</span><strong>1개</strong></div>
      </div>
      <div class="payment-total"><span>총 결제 금액</span><strong>10,000원</strong></div>
      <div class="notice-panel">본 프로토타입은 가상 재고 데이터를 사용하며 실제 결제는 진행되지 않습니다.</div>
    </div>
    <div class="screen-footer">
      ${state.stockChanged ? '<button class="primary-button" type="button" data-action="choose-other-store">다른 매장 선택</button>' : '<button class="primary-button" type="button" data-action="place-order">10,000원 결제하기</button>'}
    </div>
  `;
}

function render() {
  if (state.screen === "list") renderList();
  if (state.screen === "methods") renderMethods();
  if (state.screen === "pickup") renderPickup();
  if (state.screen === "restock") renderRestock();
  if (state.screen === "loading") renderLoading();
  if (state.screen === "inventoryError") renderInventoryError();
  if (state.screen === "order") renderOrder();
}

function setScreen(next, previous = state.screen) {
  state.previousScreen = previous;
  state.screen = next;
  render();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function handleProduct(product) {
  state.selectedProduct = product;
  state.alertDone = false;
  state.stockChanged = false;
  state.stockDepletionShown = false;
  state.orderComplete = false;

  if (product.state === "today") {
    showToast(`${product.name}을(를) 선택했어요.`);
    return;
  }
  if (product.state === "shipping") {
    state.selectedMethod = "shipping";
    setScreen("methods", "list");
    return;
  }
  if (product.state === "pickup") {
    state.selectedMethod = "pickup";
    setScreen("pickup", "list");
    return;
  }
  if (product.state === "both") {
    state.selectedMethod = "shipping";
    setScreen("methods", "list");
    return;
  }
  if (product.state === "soldout") {
    setScreen("restock", "list");
    return;
  }
  if (product.state === "unknown") {
    setScreen("loading", "list");
  }
}

screen.addEventListener("click", (event) => {
  const productButton = event.target.closest("[data-product-action]");
  if (productButton) {
    handleProduct(PRODUCTS.find((product) => product.id === productButton.dataset.productAction));
    return;
  }

  const restockButton = event.target.closest("[data-restock]");
  if (restockButton) {
    state.selectedProduct = PRODUCTS.find((product) => product.id === restockButton.dataset.restock);
    state.alertDone = false;
    setScreen("restock", "list");
    return;
  }

  const methodButton = event.target.closest("[data-method]");
  if (methodButton && !methodButton.disabled) {
    state.selectedMethod = methodButton.dataset.method;
    renderMethods();
    return;
  }

  const storeButton = event.target.closest("[data-store]");
  if (storeButton) {
    state.selectedStore = STORES.find((store) => store.id === storeButton.dataset.store);
    renderPickup();
    return;
  }

  const scopeButton = event.target.closest("[data-scope]");
  if (scopeButton) {
    state.alertScope = scopeButton.dataset.scope;
    renderRestock();
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  const action = actionButton.dataset.action;

  if (action === "close" || action === "back-list") {
    state.screen = "list";
    state.stockChanged = false;
    state.orderComplete = false;
    render();
  }
  if (action === "back") {
    if (state.screen === "pickup") setScreen("methods", "list");
    else if (state.screen === "order") setScreen(state.selectedMethod === "pickup" ? "pickup" : "methods", "list");
    else setScreen(state.previousScreen || "list", "list");
  }
  if (action === "continue-method") {
    if (state.selectedMethod === "pickup") setScreen("pickup", "methods");
    else setScreen("order", "methods");
  }
  if (action === "confirm-store") {
    state.selectedMethod = "pickup";
    state.stockChanged = false;
    setScreen("order", "pickup");
  }
  if (action === "restock") {
    state.alertDone = false;
    setScreen("restock", state.screen);
  }
  if (action === "submit-restock") {
    state.alertDone = true;
    renderRestock();
  }
  if (action === "retry-inventory") {
    setScreen("loading", "list");
  }
  if (action === "place-order") {
    if (state.selectedMethod === "pickup" && !state.stockDepletionShown) {
      state.stockChanged = true;
      state.stockDepletionShown = true;
    } else {
      state.orderComplete = true;
    }
    renderOrder();
  }
  if (action === "choose-other-store") {
    state.selectedStore = STORES[1];
    state.stockChanged = false;
    setScreen("pickup", "order");
  }
  if (action === "location") {
    showToast("프로토타입에서는 강남대로를 기준으로 보여드려요.");
  }
});

document.querySelector("#appBackButton").addEventListener("click", () => {
  if (state.screen !== "list") {
    state.screen = "list";
    render();
    return;
  }
  showToast("상품 상세 화면입니다.");
});

document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    const jump = button.dataset.jump;
    state.selectedProduct = PRODUCTS[4];
    state.alertDone = false;
    state.stockChanged = false;
    state.stockDepletionShown = false;
    state.orderComplete = false;
    if (jump === "list") setScreen("list", "list");
    if (jump === "methods") {
      state.selectedMethod = "shipping";
      setScreen("methods", "list");
    }
    if (jump === "pickup") {
      state.selectedMethod = "pickup";
      setScreen("pickup", "methods");
    }
    if (jump === "restock") setScreen("restock", "list");
  });
});

render();
