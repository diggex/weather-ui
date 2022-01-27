import React, { useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import './index.css'
import { Select, Table, Space, Card } from 'antd'

const { Option } = Select

function onSearch (val) {
  console.log('search:', val)
}

const columns = [
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name'
  },
  {
    key: 'value',
    title: 'Value',
    dataIndex: 'value'
  }
]

function App () {
  const [options, setOptions] = useState([])
  const [tableData, setTableData] = useState([])

  const onChangeCity = (value = '') => {
    fetch(`http://${process.env.REACT_APP_API_HOST}/api/weather?city=${value}`)
      .then(async (response) => {
        const responseData = await response.json()
        if (!response.ok) {
          const error =
            (responseData && responseData.message) || response.statusText
          return Promise.reject(error)
        }

        const data = [
          { key: '1', name: 'City', value: responseData.data.location },
          { key: '2', name: 'Updated time', value: responseData.data.time },
          { key: '3', name: 'Weather', value: responseData.data.weather },
          {
            key: '4',
            name: 'Temperature',
            value: responseData.data.temp_c + '°C'
          },
          {
            key: '5',
            name: 'Wind',
            value: responseData.data.wind_kph + 'km/h'
          }
        ]
        setTableData(data)
      })
      .catch((error) => {
        // this.setState({ errorMessage: error.toString() })
        console.error('There was an error!', error)
      })
  }

  useEffect(() => {
    fetch(`http://${process.env.REACT_APP_API_HOST}/api/cities`)
      .then(async (response) => {
        const responseData = await response.json()
        if (!response.ok) {
          const error =
            (responseData && responseData.message) || response.statusText
          return Promise.reject(error)
        }

        const option = []
        responseData.data.map((value, index) => {
          option.push({
            key: value,
            title: value
          })
          return option
        })
        setOptions(option)
      })
      .catch((error) => {
        // this.setState({ errorMessage: error.toString() })
        console.error('There was an error!', error)
      })

    onChangeCity()
  }, [])

  return (
    <Space direction='vertical'>
      <Card title='Weather' key='weather-1' style={{ width: 450 }}>
        <Select
          showSearch
          placeholder='Select a city'
          optionFilterProp='children'
          onChange={(value) => {
            setTableData([])
            onChangeCity(value)
          }}
          onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {options.map((option, index) => (
            <Option key={option.key} value={option.key}>
              {option.title}
            </Option>
          ))}
        </Select>
        <Table
          pagination={false}
          showHeader={false}
          columns={columns}
          dataSource={tableData}
        />
      </Card>
    </Space>
  )
}

export default App
