import React, { useState } from 'react'
import CalendarStep from './CalendarStep'
import ConfirmStep from './ConfirmStep'

const ScheduleForm: React.FC = () => {
  const [scheduleDate, setScheduleDate] = useState<Date>()

  if (!scheduleDate) {
    return <CalendarStep onSelectScheduleDate={setScheduleDate} />
  }
  return <ConfirmStep scheduleDate={scheduleDate} onCancel={setScheduleDate} />
}

export default ScheduleForm
