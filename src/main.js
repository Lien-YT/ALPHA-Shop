// import './scss/main.scss'
console.log('JS  loaded!')

const cartProducts = document.querySelector('.cart-products')
const cartFreightCost= document.querySelector('.freight-cost_b')
const cartTotal = document.querySelector('.total-cost_b')

const steps = document.querySelectorAll('.step')
const formParts = document.querySelectorAll('.part')
const shippingWay = document.getElementById('shipping-way')

const btnControl = document.getElementById('buttons-control')
const prevBtn = btnControl.querySelector('.btn-outline')
const nextBtn = btnControl.querySelector('.btn-primary')


const model = {
  step: 0,
  shippingWays: [
    {
      id: 1,
      way: "標準運送",
      description: "約 3-7 個工作天",
      cost: 0,
    },
    {
      id: 2,
      way: "DHL 貨櫃",
      description: "48 小時內送達",
      cost: 500,
    },
  ],
  cartItems: [
    {
      id: 1,
      name: "破壞補丁修身牛仔褲",
      image: "src/img/product_one.png",
      amount: 1,
      price: 3999,
      subtotal: '',
    },
    {
      id: 2,
      name: "刷色直筒牛仔褲",
      image: "src/img/product_two.png",
      amount: 1,
      price: 1299,
      subtotal: '',
    }
  ],
  calcSubtotal(cartItem) {
    cartItem.subtotal = cartItem.amount * cartItem.price;
  },
  setFreightCost(item) {
    item.cost = Number(item.cost) !== 0 ? `$${item.cost}` : '免費'
  },
  changeAmount(id, changeMode) {
    const item = this.cartItems.find((item) => item.id === Number(id));
    if (changeMode === 'plus') {
      item.amount++
    } else if (changeMode === "minus") {
      item.amount > 0 ? item.amount-- : 0
    }
    this.calcSubtotal(item)
  },
  cartTotal() {
    return (
      this.cartItems.reduce((total, item) => total + item.subtotal, 0)
    );
  }
}

const view = {
  renderCartList() {
    let rawHTML = ``;
    model.cartItems.forEach((item) => {
      model.calcSubtotal(item);
      rawHTML += `
        <div class="c-product-card w-100 mb-4 d-flex">
          <div class="c-product-img">
            <img src="${item.image}" alt="">
          </div>
          <div class="c-product-info d-grid justify-content-end align-items-center">
            <p class="c-product-name">${item.name}</p>              
            <div class="c-product-qty d-flex align-items-center" data-id="${item.id}">
              <button class="btn btn-minus"><i class="fas fa-minus"></i></button>
              <span class="c-product-qty_amount"> ${item.amount}</span>
              <button class="btn btn-plus"><i class="fas fa-plus"></i></button>
            </div>
            <b class="c-product-price price"> $${item.subtotal.toLocaleString("en-US")}</b>
          </div>
        </div>
      `
    });
    cartProducts.innerHTML = rawHTML;
  },
  renderShippingWays() {
    let rawHTML = ``;
    model.shippingWays.forEach((item) => {
      model.setFreightCost(item);
      rawHTML += `
        <div class="form-wrap" data-id="${item.id}">
          <input name="shipping-type" type="radio" value="dhl-container">
          <div class="shipping-type-desc">
            <label>${item.way}</label>
            <p>${item.description}</p>
          </div>
          <div class="shipping-type-cost">${item.cost}</div>
        </div>
      `
    });
    shippingWay.innerHTML = rawHTML
  },
  renderCartFreightCost(item) {
    cartFreightCost.innerText = item.cost
  },
  renderCartTotal() {
    cartTotal.innerText = `$${model.cartTotal().toLocaleString("en-US")}`
  },
  renderFormPart(stepA, stepB) {
    formParts[stepA].classList.toggle('d-none');
    formParts[stepB].classList.toggle('d-none')
  },
  setStepperStatus(step, direction) {
    const nowStep = steps[step]
    if (direction === 'next') {
      const nextStep = steps[step + 1]
      nowStep.classList.remove('active')
      nowStep.classList.add('checked')
      nextStep.classList.add('active')
    } else {
      const prevStep = steps[step - 1]
      nowStep.classList.remove('active')
      prevStep.classList.remove('checked')
      prevStep.classList.add('active')
    }
  },
  setBtnStatus() {
    model.step === 0
      ? prevBtn.classList.add('d-none')
      : prevBtn.classList.remove('d-none');

    model.step === formParts.length - 1
      ? nextBtn.innerHTML = '確認下單'
      : nextBtn.innerHTML = `下一步<img src="./src/img/arrow-right.png" class="ml-3"></button>`;

  },
  setWrapActive(targetId) {
    console.log(targetId)
    for (let node of shippingWay.children) {
      if (node.dataset.id === targetId ) {
        node.classList.add('active')
      } else {
        node.classList.remove('active')
      }
    }
  }
}

const controller = {
  setSite() {
    view.renderCartList();
    view.renderShippingWays();
    view.renderCartTotal();
  },
  changeCartAmount(id, changeMode) {
    model.changeAmount(id, changeMode)
    view.renderCartList()
    view.renderCartTotal()
  },
  changeStep(e) {
    if (e.target === nextBtn && e.target.innerText === '下一步') {
      view.setStepperStatus(model.step, 'next')
      view.renderFormPart(model.step, model.step + 1)
      model.step++
    } else if (e.target === prevBtn.firstElementChild) {
      view.setStepperStatus(model.step, 'prev')
      view.renderFormPart(model.step, model.step - 1)
      model.step--
    }
    view.setBtnStatus()
  },
  selectWrap(targetId) {
    view.setWrapActive(targetId)
  }
}

cartProducts.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn')
  const targetId = btn.parentElement.dataset.id
  if (btn.matches('.btn-plus')) {
    controller.changeCartAmount(targetId, 'plus')
  }
  if (btn.matches('.btn-minus')) {
    controller.changeCartAmount(targetId, 'minus')
  }
})
btnControl.addEventListener('click', (e) => {
  e.preventDefault()
  controller.changeStep(e)
})
shippingWay.addEventListener('click', (e) => {
  const targetId = e.target.closest('.form-wrap').dataset.id
  controller.selectWrap(targetId)
})

controller.setSite()