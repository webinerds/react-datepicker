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
    const minDate = moment()
      .iYear(1356)
      .iMonth(0)
      .iDate(1)
      .hour(0)
      .minute(0)
      .second(0);
    const maxDate = moment()
      .iYear(1499)
      .iMonth(11)
      .iDate(29);

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
    minDate={moment().iYear(1356).iMonth(0).iDate(1)}
    maxDate={moment().iYear(1499).iMonth(11).iDate(29)}
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
            yearDropdownItemNumber={maxDate.iYear() - minDate.iYear()}
            dateFormatCalendar="MMMM"
            scrollableYearDropdown
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      </div>
    );
  }
}
