/**
 * CONSTRUIR COMPONENTS SOBRE DEMANADA
 */
import blessed from 'blessed'
export default class ComponentsBuilder{
  #screen
  #layout
  #input

  constructor(){
  }
  /**
   * COMPONENTE PRIVADO
   * CONFIGURAÇÕES DE ESTILIZAÇÃO INICIAL DO TERMINAL
   */
  #baseComponent(){
    return {
      border: 'line',
      mouse: 'true',
      top: 0,
      scrollbars: {
        ch: '',
        inverse: true
      },
      // HABILITA COLOCAR CORES E TAGS NO TEXTO
      tags: true,
    }
  }

  /**
   * COMPONENTE QUE RETORNA A TELA
  */
  setScreen({title}){
    this.#screen = blessed.screen({
      smartCSR: true,
      title
    })
    this.#screen.key(['escape', 'q', 'C-c'], () => process.exit(0))
    console.log("Console Encerrado")
    return this
    
  }


  /**
   * COMPONENTE PAI DA TELA DO TERMINAL
  */
  setLayoutComponent(){
    this.#layout = blessed.layout({
      parent: this.#screen,
      width: '100%',
      height: '100%',
    })

    return this
  }

  /**
   * COMPONENTE FILHO, AGREGADO AO COMPONENTE PAI DA TELA DO TERMINAL
  */
  setInputComponent(onEnterPressed){
    const input = blessed.textarea({
      parent: this.#screen,
      bottom: 0,
      width: '10%',
      inputOnFocus: true,
      padding:{
        top: 1,
        left: 2
      },
      style: {
        fg: '#F6F6F6',
        bg: '#353535',
      }
    })
    input.key('enter', onEnterPressed)

    this.#input = input

    return this
  }



  build() {
    const components = {
      screen: this.#screen,
      input:  this.#input
    }
    return components
  }
}