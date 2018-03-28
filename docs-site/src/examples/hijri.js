import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment-hijri";

export default class Hijri extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment()
    };
  }

  handleChange = date => {
    this.setState({
      startDate: date
    });
  };

  render() {
    return (
      <div className="row">
        <pre className="column example__code">
          <code className="jsx">
            {`
<DatePicker
    selected={this.state.startDate}
    onChange={this.handleChange}
    calendar="hijri"
    locale="ar-sa"
    dateFormatCalendar="MMMM"
    minDate={moment().iYear(1356)}
    maxDate={moment().iYear(1500)}
/>
`}
          </code>
        </pre>
        <div className="column">
          <DatePicker
            selected={this.state.startDate}
            onChange={this.handleChange}
            calendar="hijri"
            locale="ar-sa"
            useWeekdaysShort
            showYearDropdown
            dateFormatCalendar="MMMM"
            scrollableYearDropdown
            minDate={moment().iYear(1356)}
            maxDate={moment().iYear(1500)}
          />
        </div>
      </div>
    );
  }
}
