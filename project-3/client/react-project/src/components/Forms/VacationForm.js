import { yupResolver } from '@hookform/resolvers/yup'
import dayjs from 'dayjs'
import React from 'react'
import { Form, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
export function VacationForm({
  submitForm,
  validationSchema,
  vacationData,
  selectOptions,
}) {
  const vacationErrors = useSelector((state) => state.vacations.errors)
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(validationSchema),
  })
  let currency
  if (selectOptions) {
    Object.entries(selectOptions).filter(([key, value]) => {
      if (value === vacationData.currency) currency = key
    })
  }
  return (
    <form onSubmit={handleSubmit(submitForm)} className="container mt-3 mb-3">
      <Row className="mb-3">
        <Form.Group controlId="formBasicEmail" className="col col-sm-6">
          <Form.Label>Destination</Form.Label>
          <Form.Control
            className="form-control"
            name="destination"
            type="text"
            maxLength={20}
            placeholder="destination"
            defaultValue={vacationData?.destination}
            {...register('destination')}
          />
          <small>{errors.destination ? 'destination required' : ''}</small>
        </Form.Group>
        <Form.Group controlId="formBasicEmail" className="col col-sm-6">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            className="form-control, textarea"
            placeholder="description"
            defaultValue={vacationData?.description}
            maxLength={150}
            {...register('description')}
          />
          <small>{errors.description ? 'description required' : ''}</small>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group controlId="formBasicMobile" className="col col-sm-6">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            name="startDate"
            type="date"
            min={new Date().toISOString().split('T')[0]}
            className="form-control"
            defaultValue={
              vacationData
                ? dayjs(vacationData?.startDate).format('YYYY-MM-DD')
                : null
            }
            {...register('startDate')}
          />
          <small className="smol">
            {errors.startDate ? 'please select a date' : ''}
          </small>
        </Form.Group>
        <Form.Group controlId="formBasicEmail" className="col col-sm-6">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            name="endDate"
            type="date"
            min={new Date().toISOString().split('T')[0]}
            defaultValue={
              vacationData
                ? dayjs(vacationData.endDate).format('YYYY-MM-DD')
                : null
            }
            className="form-control"
            {...register('endDate')}
          />
          <small>
            {errors.endDate?.message.includes('type')
              ? 'please select a date'
              : errors.endDate?.message}
          </small>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group className=" col col-sm-6" controlId="formGridAddress1">
          <Form.Label>Price</Form.Label>
          <Form.Control
            className="form-control"
            name="price"
            type="text"
            defaultValue={vacationData?.price}
            placeholder="price"
            {...register('price')}
          />
          <small>
            {errors.price?.message.includes('type')
              ? 'price can only be a number!'
              : errors.price?.message}
          </small>
        </Form.Group>
        <Form.Group className="col col-sm-6" controlId="formGridAddress2">
          <Form.Label>Currency</Form.Label>
          <Form.Select
            className="form-control text-center"
            name="currency"
            defaultValue={currency ? currency : 0}
            {...register('currency')}
          >
            <option className="noshow" value={0}></option>
            <option value={1}>€</option>
            <option value={2}>$</option>
            <option value={3}>₪</option>
          </Form.Select>
          <small>{errors.currency ? 'please select a currency' : ''}</small>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group>
          <Form.Control
            className="form-control"
            type="file"
            name="image"
            defaultValue={null}
            {...register('image')}
          />
          <small>{errors.image?.message}</small>
          <small>
            {vacationErrors?.includes('Image') && 'Image is required'}
          </small>
          <small>
            {vacationErrors?.includes('File') &&
              'File cannot be larger than 1MB'}
          </small>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group controlId="formGridCheckbox" className="col col-sm-6">
          <button
            type="submit"
            className="me-4 btn btn-success btn-lg btn-block"
          >
            Submit
          </button>
          <button
            type="reset"
            className="me-4 btn btn-danger btn-lg btn-block"
            onClick={() => {
              clearErrors()
            }}
          >
            Cancel
          </button>
        </Form.Group>
      </Row>
    </form>
  )
}
