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
    event.preventDefault();
    this.distancia.cliqueInicial = event.clientX;
    this.container.addEventListener('mousemove', this.iniciaMovimento);
  }

  iniciaMovimento(event) {
    const posicaoFinal = this.atualizaPosicao(event.clientX);
    this.moveSlide(posicaoFinal);
  }

  encerraSlide(event) {
    console.log('acabou');
    this.container.removeEventListener('mousemove', this.iniciaMovimento);
    this.distancia.posicaoFinal = this.distancia.posicaoMovimento
  }

  adicionaEvento() {
    this.container.addEventListener('mousedown', this.iniciaSlide);
    this.container.addEventListener('mouseup', this.encerraSlide);
  }

  iniciaClasse() {
    this.bindEventos();
    this.adicionaEvento();
    return this;
  }
}