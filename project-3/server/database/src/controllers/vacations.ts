import { readdir, readFile, unlink, writeFile } from 'fs/promises'
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
  vacationId?: number,
  addImages?: boolean
): Promise<Vacation[]> => {
  const vacations = await Vacation.find({
    ...(vacationId ? { where: { id: vacationId } } : {}),
    relations: {
      users: true,
    },
  })
  if (addImages) {
    const newVacations = []

    for (const vacation of vacations) {
      newVacations.push({
        ...vacation,
        image: await readFile(
          `../images/${await fileMatcher(vacation.imgName)}`
        ),
      })
    }
    return newVacations
  }
  return vacations
}

export const findPaginatedVacations = async (
  skip: number,
  take: number
): Promise<any> => {
  const vacations = await Vacation.findAndCount({
    relations: {
      users: true,
    },
    skip: skip,
    take: take,
  })
  const newVacations = []
  for (const vacation of vacations[0]) {
    newVacations.push({
      ...vacation,
      image: await readFile(`../images/${await fileMatcher(vacation.imgName)}`),
    })
  }
  return [newVacations, vacations[1]]
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
    const matchedFile: string = await fileMatcher(imgName)

    if (matchedFile) {
      await unlink(`../images/${matchedFile}`)
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
  const [vacation] = await findVacations(vacationId)
  const matchedFile = await fileMatcher(vacation.imgName)
  if (matchedFile) await unlink(`../images/${matchedFile}`)
  const res = await Vacation.delete(vacationId)
  return res.affected ? true : false
}

const fileMatcher = async (fileName: string) => {
  const files = await readdir('../images')
  const [matchedFile] = files.filter((file) => file.includes(fileName))
  return matchedFile
}
