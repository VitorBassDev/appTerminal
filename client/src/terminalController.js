/**
 * CONTROLADOR
 * RECEBER AS REGRAS DE NEGÓCIO 
 * DELEGAR OS EVENTOS
 * RECEBER MENSAGENS
 */

import ComponentsBuilder from "./components.js"


export default class TerminalController{
  constructor(){
  }

  #onInputReceived(eventEmitter){
    return function (){
      const message = this.getValue()
      console.log(message)
      this.clearValue()
    }
  }

  // Inicia o Projeto - initalizeTable
  async initalizeTable(eventEmitter){
    const components = new ComponentsBuilder()
      .setScreen({
        title: 'HackerChat - Vítor Guedes'})
      .setLayoutComponent()
      .setInputComponent(this.#onInputReceived(eventEmitter))
      .build()

      components.input.focus()
      components.input.render()
      
    console.log("Inicializou")
  }
}