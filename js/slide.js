import debounce from './debounce.js';

export class Slide {
  constructor(slide, container, classe) {
    this.slide = document.querySelector(slide);
    this.container = document.querySelector(container);
    this.classeAtivo = classe;
    this.distancia = {
      posicaoFinal: 0,
      cliqueInicial: 0,
      totalMovimentado: 0
    }
    this.disparaEvento = new Event('disparaEvento');
  }

  transicao(ativo) {
    this.slide.style.transition = ativo ? 'transform .3s' : '';
  }

  moveSlide(distanciaX) {
    this.distancia.posicaoMovimento = distanciaX;
    this.slide.style.transform = `translate3d(${distanciaX}px, 0px, 0px)`
  }

  atualizaPosicao(clientX) {
    this.distancia.totalMovimentado = (this.distancia.cliqueInicial - clientX) * 1.6;
    return this.distancia.posicaoFinal - this.distancia.totalMovimentado;
  }

  iniciaSlide(event) {
    let tipoMovimento;
    if (event.type === 'mousedown') {
      event.preventDefault();
      this.distancia.cliqueInicial = event.clientX;
      tipoMovimento = 'mousemove';
    } else {
      this.distancia.cliqueInicial = event.changedTouches[0].clientX;
      tipoMovimento = 'touchmove'
    }
    this.container.addEventListener(tipoMovimento, this.iniciaMovimento);
    this.transicao(false);
  }

  iniciaMovimento(event) {
    const ponteiroInicial = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
    const posicaoFinal = this.atualizaPosicao(ponteiroInicial);
    this.moveSlide(posicaoFinal);
  }

  encerraSlide(event) {
    const tipoMovimento = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
    this.container.removeEventListener(tipoMovimento, this.iniciaMovimento);
    this.distancia.posicaoFinal = this.distancia.posicaoMovimento;
    this.transicao(true);
    this.mudaSlideNoFinal();
  }

  mudaSlideNoFinal() {
    if (this.distancia.totalMovimentado > 120 && this.index.proximo !== undefined) {
      this.ativaProximoSlide();
    } else if (this.distancia.totalMovimentado < -120 && this.index.anterior !== undefined) {
      this.ativaSlideAnterior();
    } else {
      this.centralizaSlide(this.index.ativo)
    }
  }

  adicionaEvento() {
    this.container.addEventListener('mousedown', this.iniciaSlide);
    this.container.addEventListener('touchstart', this.iniciaSlide);
    this.container.addEventListener('mouseup', this.encerraSlide);
    this.container.addEventListener('touchend', this.encerraSlide);
  }

  // configurações do slide

  posicaoSlide(slide) {
    const centro = (this.container.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - centro);
  }

  configuraSlides() {
    this.slideArray = [...this.slide.children].map((elemento) => {
      const posicao = this.posicaoSlide(elemento);
      return { elemento, posicao, };
    });
  }

  navegacaoSlides(index) {
    const ultimoSlide = this.slideArray.length - 1;
    this.index = {
      anterior: index ? index - 1 : undefined,
      ativo: index,
      proximo: index === ultimoSlide ? undefined : index + 1,
    }
  }

  centralizaSlide(index) {
    const slideAtivo = this.slideArray[index];
    this.moveSlide(slideAtivo.posicao);
    this.navegacaoSlides(index);
    this.distancia.posicaoFinal = slideAtivo.posicao;
    this.mudaClasseAtivo();
    this.container.dispatchEvent(this.disparaEvento);
  }

  mudaClasseAtivo() {
    this.slideArray.forEach((item) => item.elemento.classList.remove(this.classeAtivo));
    this.slideArray[this.index.ativo].elemento.classList.add(this.classeAtivo);
  }

  ativaSlideAnterior() {
    if (this.index.anterior !== undefined) {
      this.centralizaSlide(this.index.anterior);
    }
  }

  ativaProximoSlide() {
    if (this.index.proximo !== undefined) {
      this.centralizaSlide(this.index.proximo);
    }
  }

  noResize() {
    setTimeout(() => {
      this.configuraSlides();
      this.centralizaSlide(this.index.ativo);
    }, 1000)
  }

  adicionaEventoRisize() {
    window.addEventListener('resize', this.noResize)
  }

  bindEventos() {
    this.iniciaSlide = this.iniciaSlide.bind(this);
    this.iniciaMovimento = this.iniciaMovimento.bind(this);
    this.encerraSlide = this.encerraSlide.bind(this);

    this.ativaSlideAnterior = this.ativaSlideAnterior.bind(this);
    this.ativaProximoSlide = this.ativaProximoSlide.bind(this);

    this.noResize = debounce(this.noResize.bind(this), 200);
  }

  iniciaClasse() {
    this.bindEventos();
    this.transicao(true);
    this.adicionaEvento();
    this.configuraSlides();
    this.adicionaEventoRisize();
    this.centralizaSlide(0);
    return this;
  }
}

export class NavegacaoSlide extends Slide {
  constructor(slide, container, classe) {
    super(slide, container, classe)
    this.controleEventoBind();
  }
  adicionaSetas(anterior, proximo) {
    this.elementoAnterior = document.querySelector(anterior);
    this.proximoElemento = document.querySelector(proximo);
    this.adicionaEventoSetas();
  }

  adicionaEventoSetas() {
    this.elementoAnterior.addEventListener('click', this.ativaSlideAnterior);
    this.proximoElemento.addEventListener('click', this.ativaProximoSlide);
  }

  criaControle() {
    const controle = document.createElement('ul');
    controle.dataset.controle = 'slide';

    this.slideArray.forEach((item, index) => {
      controle.innerHTML += `<li><a href="#slide${index + 1}">${index + 1}</a></li>`;
    })
    this.container.appendChild(controle);
    return controle;
  }

  eventoControle(item, index) {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      this.centralizaSlide(index);
    });
    this.container.addEventListener('disparaEvento', this.controleAtivo);
  }

  adicionaControle(customizaControle) {
    this.controle = document.querySelector(customizaControle) || this.criaControle();
    this.arrayControle = [...this.controle.children];
    this.arrayControle.forEach(this.eventoControle);
    this.controleAtivo();
  }
  
  controleAtivo() {
    this.arrayControle.forEach((item) => item.classList.remove(this.classeAtivo));
    this.arrayControle[this.index.ativo].classList.add(this.classeAtivo);
  }

  controleEventoBind() {
    this.eventoControle = this.eventoControle.bind(this);
    this.controleAtivo = this.controleAtivo.bind(this);
  }
}