/**
 * CONTROLADOR
 * RECEBER AS REGRAS DE NEGÓCIO 
 * DELEGAR OS EVENTOS
 * RECEBER MENSAGENS
 */

import ComponentsBuilder from "./components.js"


export default class TerminalController{
  #usersCollors = new Map()
  constructor(){
  }

  /**
   * GERADOR DE CORES ALEATÓRIAS
   */
  #pickCollor(){
    return `#` + ( (1 << 24) * Math.random() | 0 ).toString(16) + `-fg`
  }

  /**
   * GERENCIAR A COR DO USUÁRIO
  */
  #getUserCollor(userName){
    if(this.#usersCollors.has(userName)) 
      return  this.#usersCollors.get(userName)

    const collor = this.#pickCollor()
    this.#usersCollors.set(userName, collor)

    return collor
  }

  /**
   * FUNÇÃO - onInputReceived
   * Sempre retorna a situação para o backend quando
   * uma mensagem nova chega no chat
   */
  #onInputReceived(eventEmitter){
    return function(){
      const message = this.getValue()
      console.log(message)
      this.clearValue()
    }
  }

  #onMessageReceived({ screen, chat }){
    return msg => {
      const { userName, message } = msg 
      const collor = this.#getUserCollor(userName)
      
      chat.addItem(`{${collor}}{bold}${userName}{/}: ${message}`)
      screen.render()
    }
  }

  /**
   * Escutar os eventos para mostrar na tela
   */
  #registerEvents(eventEmitter, components){
    /**
      eventEmitter.emit('turma01', 'Hellow Class')
      eventEmitter.on('turma01', msg => console.log(msg.toString()))
     */
    eventEmitter.on('message:received', this.#onMessageReceived(components))
  }

  // Inicia o Projeto - initalizeTable
  async initalizeTable(eventEmitter){
    const components = new ComponentsBuilder()
      .setScreen({ title: 'HackerChat - Vítor Guedes'})
      .setLayoutComponent()
      .setInputComponent(this.#onInputReceived(eventEmitter))
      .setChatComponent()
      .setActivityLogComponent()
      .setStatusComponent()
      .build()
      
      this.#registerEvents(eventEmitter, components)

      components.input.focus()
      components.input.render() 

      setInterval(() => {
        eventEmitter.emit('message:received', {message: 'hey', userName: 'Vitor'})
        eventEmitter.emit('message:received', {message: 'Olá', userName: 'Théo'})
        eventEmitter.emit('message:received', {message: 'Hoop', userName: 'Kuerem'})
      }, 1000)

  }
}