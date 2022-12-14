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

// export const update = async (id: string, data: Customer): Promise<boolean> => {
//   const { firstName, lastName, email, points } = data
//   if (
//     firstName === undefined &&
//     lastName === undefined &&
//     email === undefined &&
//     points === undefined
//   ) {
//     return false
//   }

//   const customer = new customerModel(firstName, lastName, email, points)

//   const [res] = await customer.update(id)

//   return res.affectedRows ? true : false
// }
