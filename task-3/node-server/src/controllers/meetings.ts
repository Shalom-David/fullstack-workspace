import { Meeting } from '../interfaces/meetings'
import MeetingModel from '../models/meetings'

export const save = async (data: Meeting): Promise<number | null> => {
  try {
    const { team_name, start_time, end_time, description, room } = data
    const meeting = new MeetingModel(
      team_name,
      start_time,
      end_time,
      description,
      room
    )
    const [res] = await meeting.save()

    return res.affectedRows ? res.insertId : null
  } catch (error) {
    return null
  }
}

export const find = async (id?: string): Promise<any> => {
  const [meeting] = await MeetingModel.find(id)
  return meeting
}
