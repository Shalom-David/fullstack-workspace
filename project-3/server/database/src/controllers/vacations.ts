import { access, readdir, readFile, unlink, writeFile } from 'fs/promises'
import { CONSTANTS } from '../constants'
import { Vacation } from '../entity/Vacation'

export const createVacation = async (
  record: Vacation,
  file: Express.Multer.File
): Promise<Vacation> => {
  const timestamp = Date.now()
  const vacation = Vacation.create(record)
  vacation.imgName = timestamp.toString()
  await vacation.save()
  await writeFile(
    `../images/${timestamp}.${file.mimetype.split('/')[1]}`,
    file.buffer
  )
  return vacation
}

export const findVacations = async (
  vacationId?: number
): Promise<Vacation[]> => {
  return await Vacation.find({
    ...(vacationId ? { where: { id: vacationId } } : {}),
    relations: {
      users: true,
    },
  })
}

export const updateVacation = async (
  vacationId: number,
  file: Express.Multer.File,
  data: any
): Promise<Vacation | string | Error> => {
  let { imgName, ...dataProps } = data
  const timestamp = Date.now()
  const [vacation] = await findVacations(vacationId)
  if (!vacation) {
    throw new Error(CONSTANTS.ERRORS.NOT_FOUND_ERROR)
  }
  if (file) {
    const savedFiles = await readdir('../images')
    const match = savedFiles.filter((savedFile) => {
      return savedFile.includes(data.imgName)
    })

    if (match.length) {
      await unlink(`../images/${match[0]}`)
      await writeFile(
        `../images/${timestamp}.${file.mimetype.split('/')[1]}`,
        file.buffer
      )
      imgName = timestamp.toString()
    }
  }
  for (const prop in dataProps) {
    vacation[prop] = dataProps[prop]
  }
  vacation.imgName = imgName
  return await vacation.save()
}

export const deleteVacation = async (vacationId: number): Promise<boolean> => {
  const res = await Vacation.delete(vacationId)
  return res.affected ? true : false
}
