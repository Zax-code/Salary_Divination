"use client"
import { useState } from 'react'

interface Customer_Info {
  work_year: number
  experience_level: string
  employment_type: string
  job_title: string
  salary_currency: string
  employee_residence: string
  company_location: string
  company_size: string
  remote_ratio: number
}

export default function Home() {
  const [customerInfo, setCustomerInfo] = useState<Customer_Info>({
    work_year: 0,
    experience_level: '',
    employment_type: '',
    job_title: '',
    salary_currency: '',
    employee_residence: '',
    company_location: '',
    company_size: '',
    remote_ratio: 0,
  })
  const [prediction, setPrediction] = useState<number>(0);
  //Fetch /api/predict with json object : {'work_year': '2023', 'experience_level': 'SE', 'employment_type': 'FT', 'job_title': 'Data Engineer', 'salary_currency': 'USD', 'employee_residence': 'US', 'company_location': 'US', 'company_size': 'M', 'remote_ratio': 50}
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    fetch('http://localhost:3000/api/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerInfo),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data)
        setPrediction(data.predicted_salary[0])
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }
  fetch('http://localhost:3000/api/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      work_year: 2023,
      experience_level: 'SE',
      employment_type: 'FT',
      job_title: 'Data Engineer',
      salary_currency: 'USD',
      employee_residence: 'US',
      company_location: 'US',
      company_size: 'M',
      remote_ratio: 50,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form className="flex flex-col items-center justify-between" onSubmit={handleSubmit}>
        <h1 className="text-4xl font-bold mb-8">Salary Prediction</h1>
        <div className="flex flex-col items-center justify-between mb-8">
          <label htmlFor="work_year" className="mb-2">
            Work Year
          </label>
          <input
            type="number"
            id="work_year"
            name="work_year"
            value={customerInfo.work_year}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, work_year: parseInt(e.target.value) })
            }
            className="p-2 mb-4 text-black"
          />
        </div>
        <div className="flex flex-col items-center justify-between mb-8">
          <label htmlFor="experience_level" className="mb-2">
            Experience Level
          </label>
          <input
            type="text"
            id="experience_level"
            name="experience_level"
            value={customerInfo.experience_level}
            onChange={(e) =>
              setCustomerInfo({
                ...customerInfo,
                experience_level: e.target.value,
              })
            }
            className="p-2 mb-4 text-black"
          />
        </div>
        <div className="flex flex-col items-center justify-between mb-8">
          <label htmlFor="employment_type" className="mb-2">
            Employment Type
          </label>
          <input
            type="text"
            id="employment_type"
            name="employment_type"
            value={customerInfo.employment_type}
            onChange={(e) =>
              setCustomerInfo({
                ...customerInfo,
                employment_type: e.target.value,
              })
            }
            className="p-2 mb-4 text-black"
          />
        </div>
        <div className="flex flex-col items-center justify-between mb-8">
          <label htmlFor="job_title" className="mb-2">
            Job Title
          </label>
          <input
            type="text"
            id="job_title"
            name="job_title"
            value={customerInfo.job_title}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, job_title: e.target.value })
            }
            className="p-2 mb-4 text-black"
          />
        </div>
        <div className="flex flex-col items-center justify-between mb-8">
          <label htmlFor="salary_currency" className="mb-2">
            Salary Currency
          </label>
          <input
            type="text"
            id="salary_currency"
            name="salary_currency"
            value={customerInfo.salary_currency}
            onChange={(e) =>
              setCustomerInfo({
                ...customerInfo,
                salary_currency: e.target.value,
              })
            }
            className="p-2 mb-4 text-black"
          />
        </div>
        <div className="flex flex-col items-center justify-between mb-8">
          <label htmlFor="employee_residence" className="mb-2">
            Employee Residence
          </label>
          <input
            type="text"
            id="employee_residence"
            name="employee_residence"
            value={customerInfo.employee_residence}
            onChange={(e) =>
              setCustomerInfo({
                ...customerInfo,
                employee_residence: e.target.value,
              })
            }
            className="p-2 mb-4 text-black"
          />
        </div>
        <div className="flex flex-col items-center justify-between mb-8">
          <label htmlFor="company_location" className="mb-2">
            Company Location
          </label>
          <input
            type="text"
            id="company_location"
            name="company_location"
            value={customerInfo.company_location}
            onChange={(e) =>
              setCustomerInfo({
                ...customerInfo,
                company_location: e.target.value,
              })
            }
            className="p-2 mb-4 text-black"
          />
        </div>
        <div className="flex flex-col items-center justify-between mb-8">
          <label htmlFor="company_size" className="mb-2">
            Company Size
          </label>
          <input
            type="text"
            id="company_size"
            name="company_size"
            value={customerInfo.company_size}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, company_size: e.target.value })
            }
            className="p-2 mb-4 text-black"
          />
        </div>
        <div className="flex flex-col items-center justify-between mb-8">
          <label htmlFor="remote_ratio" className="mb-2">
            Remote Ratio
          </label>
          <input
            type="number"
            id="remote_ratio"
            name="remote_ratio"
            value={customerInfo.remote_ratio}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, remote_ratio: parseInt(e.target.value) })
            }
            className="p-2 mb-4 text-black"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Submit
        </button>
      </form>

      <div className="flex flex-col items-center justify-between">
        <h1 className="text-4xl font-bold mb-8">Prediction</h1>
        <p className="text-2xl font-bold mb-8">{prediction}$ a year</p>
      </div>
    </main>
  )
}
