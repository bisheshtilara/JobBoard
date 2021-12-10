<template>
  <div>
    <div v-if="minimal" class="flex justify-between flex-1 px-3">
      <div class="flex items-center">
        <span class="mr-3 font-medium text-15 text-primary-gray">
          {{ dateContext.format('MMMM YYYY') }}
        </span>
      </div>
      <div class="flex items-center">
        <div class="rounded-full bg-primary-lighterGray">
          <unicon
            class="p-1 -mb-2"
            name="angle-left-b"
            fill="black"
            @click="subtractMonth"
          />
        </div>
        <div class="rounded-full bg-primary-lighterGray">
          <unicon
            class="p-1 -mb-2"
            name="angle-right-b"
            fill="black"
            @click="addMonth"
          />
        </div>
      </div>
    </div>
    <div v-else class="flex justify-between flex-1 py-2">
      <unicon
        v-if="calendarData.view === 'month'"
        name="angle-left-b"
        fill="black"
        @click="subtractMonth"
      />
      <unicon
        v-else-if="calendarData.view === 'day'"
        name="angle-left-b"
        fill="black"
        @click="subtractDay"
      />
      <unicon v-else name="angle-left-b" fill="black" @click="subtractWeek" />
      <div class="flex items-center">
        <span v-if="calendarData.view === 'month'" class="mr-3">
          {{ month + ' ' + year }}
        </span>
        <span v-else-if="calendarData.view === 'day'" class="mr-3">
          {{ dateContext.format('dddd DD/MM') }}
        </span>
        <span v-else class="mr-3">
          {{ month + ' week ' + weekOfMonth }}
        </span>
        <unicon
          name="schedule"
          fill="lightGray"
          class="mb-1"
          @click="changeView()"
        />
      </div>
      <unicon
        v-if="calendarData.view === 'month'"
        name="angle-right-b"
        fill="black"
        @click="addMonth"
      />
      <unicon
        v-else-if="calendarData.view === 'day'"
        name="angle-right-b"
        fill="black"
        @click="addDay"
      />
      <unicon v-else name="angle-right-b" fill="black" @click="addWeek" />
    </div>
    <ul v-if="calendarData.view != 'day'" class="grid grid-cols-7">
      <li
        v-for="(day, i) in days"
        :key="'dayName' + i"
        style="width: 40px; height: 30px"
        class="flex items-center justify-center font-medium text-primary-gray"
      >
        {{ day }}
      </li>
    </ul>
    <div v-if="calendarData.view === 'month'">
      <ul class="grid grid-cols-7">
        <li
          v-for="(blank, i) in firstDayOfMonth"
          :key="'blank' + i"
          style="width: 40px; height: 40px"
          class="flex items-center justify-center"
        >
          &nbsp;
        </li>
        <li v-for="(date, i) in daysInMonth" :key="'numb' + i">
          <div
            :class="
              dayClass($moment(dateContext).startOf('month').add(i, 'day'))
            "
            class="flex items-center justify-center rounded-full"
            style="width: 40px; height: 40px"
            @click="
              selectDate($moment(dateContext).startOf('month').add(i, 'day'))
            "
          >
            <span>
              {{
                $moment(dateContext).startOf('month').add(i, 'day').get('date')
              }}
            </span>
          </div>
        </li>
      </ul>
    </div>
    <div v-else-if="calendarData.view === 'day'"></div>
    <div v-else>
      <ul class="grid grid-cols-7">
        <li v-for="(_, i) in 7" :key="'numb' + i">
          <div
            :class="
              dayClass($moment(dateContext).startOf('week').add(i, 'day'))
            "
            class="flex items-center justify-center rounded-full"
            style="width: 40px; height: 40px"
            @click="selectDate(dayOfWeek(i))"
          >
            <span>
              {{ dayOfWeek(i).get('date') }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CalendarComponent',
  props: {
    calendarData: {
      type: Object,
      required: true
    },
    minimal: {
      type: Boolean,
      default: false
    },
    interactive: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      today: this.$moment(),
      dateContext: this.$moment(),
      days: this.$moment.weekdaysMin()
    }
  },
  computed: {
    year() {
      return this.dateContext.format('Y')
    },
    month() {
      return this.dateContext.format('MMMM')
    },
    daysInMonth() {
      return this.dateContext.daysInMonth()
    },
    startOfWeek() {
      return this.$moment(this.calendarData.selectedDate)
        .startOf('week')
        .get('date')
    },
    currentDate() {
      return this.$moment(this.dateContext).get('date')
    },
    weekOfMonth() {
      const firstDayOfMonth = this.$moment(this.dateContext)
        .clone()
        .startOf('month')
      const firstDayOfWeek = firstDayOfMonth.clone().startOf('week')

      const offset = firstDayOfMonth.diff(firstDayOfWeek, 'days')

      return Math.ceil((this.$moment(this.dateContext).date() + offset) / 7)
    },
    selectedDate() {
      return this.calendarData.selectedDate.get('date')
    },
    selectedMonth() {
      return this.calendarData.selectedDate.format('MMMM')
    },
    selectedYear() {
      return this.calendarData.selectedDate.format('Y')
    },
    firstDayOfMonth() {
      return this.$moment(this.dateContext).startOf('month').weekday()
    },
    initialDate() {
      return this.today.get('date')
    },
    initialMonth() {
      return this.today.format('MMMM')
    },
    initialYear() {
      return this.today.format('Y')
    }
  },
  methods: {
    changeView(view = null) {
      if (view) {
        this.$emit('update:calendarData', {
          ...this.calendarData,
          view
        })
      } else if (this.calendarData.view === 'day') {
        this.$emit('update:calendarData', {
          ...this.calendarData,
          view: 'week'
        })
      } else {
        this.$emit('update:calendarData', {
          ...this.calendarData,
          view: this.calendarData.view === 'month' ? 'week' : 'month'
        })
      }
    },
    dayOfWeek(i) {
      return this.$moment(this.dateContext).startOf('week').add(i, 'days')
    },
    addMonth() {
      this.dateContext = this.$moment(this.dateContext).add(1, 'month')
    },
    subtractMonth() {
      this.dateContext = this.$moment(this.dateContext).subtract(1, 'month')
    },
    addWeek() {
      this.dateContext = this.$moment(this.dateContext).add(1, 'week')
    },
    subtractWeek() {
      this.dateContext = this.$moment(this.dateContext).subtract(1, 'week')
    },
    dayClass(m) {
      if (!this.multiple && m.isSame(this.calendarData.selectedDate, 'day')) {
        return 'bg-primary-accent text-white'
      } else if (
        this.multiple &&
        this.calendarData.selectedDates.filter((date) => date.isSame(m, 'day'))
          .length > 0
      ) {
        return 'bg-primary-accent text-white'
      } else if (this.calendarData.offersDates?.length > 0) {
        for (let offerDate of this.calendarData.offersDates) {
          if (m.isSame(this.$moment(offerDate), 'day')) {
            if (m.isSame(this.today, 'day')) {
              return 'border border-primary-accent bg-primary-accentLight'
            }
            return 'bg-primary-accentLight'
          }
        }
      } else if (m.isSame(this.today, 'day')) {
        return 'border border-primary-accent'
      } else {
        return ''
      }
    },
    selectDate(m) {
      if (!this.interactive) {
        return
      }
      if (this.multiple) {
        let toRemove = this.calendarData.selectedDates.filter((date) =>
          date.isSame(this.$moment(m), 'day')
        )
        if (toRemove.length === 0) {
          this.calendarData.selectedDates.push(this.$moment(m))
        } else {
          this.calendarData.selectedDates =
            this.calendarData.selectedDates.filter(
              (date) => !toRemove.includes(date)
            )
        }
      }
      this.calendarData.selectedDate = this.$moment(m)
      this.dateContext = this.$moment(m)
      if (this.minimal) {
        return
      }
    }
  }
}
</script>
