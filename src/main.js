import './scss/main.scss'
console.log('JS  loaded!')

const cartProducts = document.querySelector('.cart-products')
const cartTotal = document.querySelector('.total-cost_b')
const formParts = document.querySelectorAll('.part')
const steps = document.querySelectorAll('.step')
const btnControl = document.getElementById('buttons-control')
const prevBtn = btnControl.querySelector('.btn-outline')
const nextBtn = btnControl.querySelector('.btn-primary')


const model = {
  step: 0, 
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
  calcSubtotal(item) {
    item.subtotal = item.amount * item.price;
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
      : prevBtn.classList.remove('d-none') ;

    model.step === formParts.length - 1
      ? nextBtn.innerHTML = '確認下單'
      : nextBtn.innerHTML = `下一步<img src="./src/img/arrow-right.png" class="ml-3"></button>`;
    
  },  
}

const controller = {
  setSite() {
    view.renderCartList();
    view.renderCartTotal()
  },
  changeStep(e) {
    if (e.target === nextBtn && e.target.innerText === '下一步') {
      view.setStepperStatus(model.step, 'next')
      view.renderFormPart(model.step, model.step + 1)
      model.step ++
    } else if (e.target === prevBtn.firstElementChild) {
      view.setStepperStatus(model.step, 'prev')
      view.renderFormPart(model.step, model.step - 1)
      model.step --
    }
    view.setBtnStatus()
  },
  changeCartAmount(id, changeMode) {
    model.changeAmount(id,changeMode)
    view.renderCartList()
    view.renderCartTotal()
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

controller.setSite()