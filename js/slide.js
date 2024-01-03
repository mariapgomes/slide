import debounce from './debounce.js';

export default class Slide {
  constructor(slide, container, classe) {
    this.slide = document.querySelector(slide);
    this.container = document.querySelector(container);
    this.classeAtivo = classe;
    this.distancia = {
      posicaoFinal: 0,
      cliqueInicial: 0,
      totalMovimentado: 0
    }
  }

  atualizaPosicao(clientX) {
    this.distancia.totalMovimentado = (this.distancia.cliqueInicial - clientX) * 1.6;
    return this.distancia.posicaoFinal - this.distancia.totalMovimentado;
  }

  transicao(ativo) {
    this.slide.style.transition = ativo ? 'transform .3s' : '';
  }

  moveSlide(distanciaX) {
    this.distancia.posicaoMovimento = distanciaX;
    this.slide.style.transform = `translate3d(${distanciaX}px, 0px, 0px)`
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
      proximo: index === ultimoSlide ? undefined : index + 1
    }
  }

  centralizaSlide(index) {
    const slideAtivo = this.slideArray[index];
    this.moveSlide(slideAtivo.posicao);
    this.navegacaoSlides(index);
    this.distancia.posicaoFinal = slideAtivo.posicao;
    this.mudaClasseAtivo();
  }

  mudaClasseAtivo() {
    this.slideArray.forEach((item) => item.elemento.classList.remove(this.classeAtivo));
    this.slideArray[this.index.ativo].elemento.classList.add(this.classeAtivo);
  }

  ativaSlideAnterior() {
    if (this.index.anterior !== undefined) {
      this.navegacaoSlides(this.index.anterior);
    }
  }

  ativaProximoSlide() {
    if (this.index.proximo !== undefined) {
      this.navegacaoSlides(this.index.proximo);
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
    this.noResize = debounce(this.noResize.bind(this), 200);
  }

  iniciaClasse() {
    this.bindEventos();
    this.transicao(true);
    this.adicionaEvento();
    this.configuraSlides();
    this.adicionaEventoRisize();
    return this;
  }
}