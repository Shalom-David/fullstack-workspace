import db from '../db'

export default class Meeting {
  constructor(
    private team_name: string,
    private start_time: Date,
    private end_time: Date,
    private description: string,
    private room: string
  ) {}

  async save(): Promise<any> {
    const query = `
      insert into meetings (team_id, start_time, end_time, description, room)  
      values((select id from dev_teams where name = '${this.team_name}'), '${this.start_time}', '${this.end_time}', '${this.description}', '${this.room}')
      `

    return await db.execute(query)
  }

  static async find(id?: string): Promise<any> {
    const query = `
      select * from meetings ${id ? `where exists (select id from dev_teams where meetings.team_id = ${id})` : ''}
      `

    return db.execute(query)
  }

  async update(id: string): Promise<any> {
    const setStatement = ` 
       ${this.team_name ? `team_name = (select id from dev_teams where name = ${this.team_name}),` : ''}
       ${this.start_time ? `start_time = '${this.start_time}',` : ''}
       ${this.end_time ? `end_time = '${this.end_time}',` : ''}
       ${this.description ? `description = '${this.description}',` : ''}
       ${this.room ? `room = '${this.room}',` : ''}
      `
      .trim()
      .replace(/,$/, '')

    const query = `
          update meetings set
          ${setStatement}
          where id = ${id}
        `

    return await db.execute(query)
  }
}
