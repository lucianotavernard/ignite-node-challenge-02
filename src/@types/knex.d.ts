declare module 'knex/types/tables' {
  export interface Tables {
    user: {
      id: string
      username: string
    }
    snack: {
      id: string
      name: string
      description: string
      sessionId: string
      createAt: string
      status: boolean
    }
  }
}
