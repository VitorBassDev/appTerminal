/**
 * CONTROLADOR
 * RECEBER AS REGRAS DE NEGÓCIO 
 * DELEGAR OS EVENTOS
 * RECEBER MENSAGENS
 */

import ComponentsBuilder from "./components.js"
import {constants}       from "./constants.js"


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
      //console.log(message)
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
   * ESCUTAR OS EVENTOS DE LOG DE ATIVIDADES DOS USUÁRIOSS
   */
  #onLogChanged({ screen, activityLog }){
    return msg => {
      // ENTROU O OU SAIU DO CHAT
      const [userName] = msg.split(/\s/)
      const collor     = this.#getUserCollor(userName)
      activityLog.addItem(`{${collor}}{bold}${msg.toString()}{/}`)
      screen.render()
    }
  }

  /**
   * ESCUTAR OS EVENTOS DE STATUS DOS USUÁRIOS DA SALA
   */
  #onStatusChanged({ screen, status }){
    // BUSCAR OS USUÁRIOS
    return users => {

      // PEGAR O PRIMEIRO ELEMENTO DA LISTA
      const {content} = status.items.shift()
      status.clearItems()
      status.addItem(content)

      users.forEach(userName =>{
        const collor  = this.#getUserCollor(userName)
        status.addItem(`{${collor}}{bold}${userName}{/}`)
      })
      screen.render()
    }
  }

  /**
   * REPASSA OS EVENTOS PARA MOSTRAR NA TELA
   */
  #registerEvents(eventEmitter, components){

    eventEmitter.on(constants.events.app.MESSAGE_RECEIVED,
      this.#onMessageReceived(components))

    eventEmitter.on(constants.events.app.ACTIVITYLOG_UPDATED, 
      this.#onLogChanged(components))

    eventEmitter.on(constants.events.app.STATUS_UPDATED, 
      this.#onStatusChanged(components))
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
/** */
    // -- TESTAR A MENSAGEM DOS USUÁRIOS NO CONSOLE
    //   setInterval(() => {
    //     eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, {message: 'Olá',    userName: '....... vitor left' })
    //     eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, {message: 'Hellow', userName: '....... Théo join'  })
    //     eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, {message: 'HOOOP',  userName: '....... Kuerem Left'})
    //   }, 1000)

    // // -- TESTAR A ATIVIDADE DOS USUÁRIOS NO CONSOLE
    //   setInterval(() => {
    //     eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, 'vitor left')
    //     eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, 'Théo join',)
    //     eventEmitter.emit(constants.events.app.ACTIVITYLOG_UPDATED, 'Kuerem Left')
    //   }, 1000)
    
    // // -- TESTAR O STATUS DOS USUÁRIOS NO CONSOLE
    //  // setInterval(() => {
    //     const users = ['Vitor']
    //     eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
    //     users.push('vitor guedes')
    //     eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
    //     users.push('theo')
    //     eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
    //     users.push('kuerem')
    //     eventEmitter.emit(constants.events.app.STATUS_UPDATED, users)
    //     users.push('zeze', 'de camargo')
    //  // }, 1000)
  }
}