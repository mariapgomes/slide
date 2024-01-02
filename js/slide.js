export default class Slide {
  constructor(slide, container) {
    this.slide = document.querySelector(slide);
    this.container = document.querySelector(container);
    this.distancia = {
      posicaoFinal: 0,
      cliqueInicial: 0,
      totalMovimentado: 0
    }
  }

  bindEventos() {
    this.iniciaSlide = this.iniciaSlide.bind(this);
    this.iniciaMovimento = this.iniciaMovimento.bind(this);
    this.encerraSlide = this.encerraSlide.bind(this);
  }

  atualizaPosicao(clientX) {
    this.distancia.totalMovimentado = (this.distancia.cliqueInicial - clientX) * 1.6;
    return this.distancia.posicaoFinal - this.distancia.totalMovimentado;
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
  }

  iniciaMovimento(event) {
    const ponteiroInicial = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX;
    const posicaoFinal = this.atualizaPosicao(ponteiroInicial);
    this.moveSlide(posicaoFinal);
  }

  encerraSlide(event) {
    const tipoMovimento = (event.type === 'mouseup') ? 'mousemove' : 'touchmove';
    this.container.removeEventListener(tipoMovimento, this.iniciaMovimento);
    this.distancia.posicaoFinal = this.distancia.posicaoMovimento
  }

  adicionaEvento() {
    this.container.addEventListener('mousedown', this.iniciaSlide);
    this.container.addEventListener('touchstart', this.iniciaSlide);
    this.container.addEventListener('mouseup', this.encerraSlide);
    this.container.addEventListener('touchend', this.encerraSlide);
  }

  iniciaClasse() {
    this.bindEventos();
    this.adicionaEvento();
    return this;
  }
}