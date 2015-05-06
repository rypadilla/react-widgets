'use strict';
var React = require('react')
  , cx    = require('classnames')
  , dates = require('./util/dates')
  , CustomPropTypes = require('./util/propTypes')
  , _   = require('./util/_')
  , Btn = require('./WidgetButton');

module.exports = React.createClass({

  displayName: 'MonthView',

  mixins: [
    require('./mixins/WidgetMixin'),
    require('./mixins/RtlChildContextMixin')
  ],

  propTypes: {
    culture:          React.PropTypes.string,
    value:            React.PropTypes.instanceOf(Date),
    focused:          React.PropTypes.instanceOf(Date),
    min:              React.PropTypes.instanceOf(Date),
    max:              React.PropTypes.instanceOf(Date),

    dayFormat:        CustomPropTypes.localeFormat.isRequired,
    dateFormat:       CustomPropTypes.localeFormat.isRequired,

    onChange:         React.PropTypes.func.isRequired, //value is chosen
  },

  render: function(){
    var props = _.omit(this.props, ['max', 'min', 'value', 'onChange'])
      , month = dates.visibleDays(this.props.focused, this.props.culture)
      , rows  = _.chunk(month, 7 );

    return (
      <table {...props}
        role='grid'
        className='rw-calendar-grid'
        aria-activedescendant={this._id('_selected_item')}>
        <thead>
          <tr>{this._headers(props.dayFormat, props.culture)}</tr>
        </thead>
        <tbody>
          { rows.map(this._row)}
        </tbody>
      </table>
    )
  },

  _row: function(row, i){
    var id = this._id('_selected_item')
    
    return (
      <tr key={'week_' + i} role='row'>
      { row.map( (day, idx) => {
        var focused  = dates.eq(day, this.props.focused, 'day')
          , selected = dates.eq(day, this.props.value, 'day')
          , today = dates.eq(day, this.props.today, 'day');

        return !dates.inRange(day, this.props.min, this.props.max)
            ? <td  key={'day_' + idx} role='gridcell' className='rw-empty-cell' >&nbsp;</td>
            : (<td key={'day_' + idx} role='gridcell'>
                <Btn
                  tabIndex='-1'
                  onClick={this.props.onChange.bind(null, day)}
                  aria-pressed={selected}
                  aria-disabled={this.props.disabled || undefined}
                  disabled={this.props.disabled}
                  className={cx({
                    'rw-off-range':      dates.month(day) !== dates.month(this.props.focused),
                    'rw-state-focus':    focused,
                    'rw-state-selected': selected,
                    'rw-now': today
                  })}
                  id={focused ? id : undefined}>
                  {dates.format(day, this.props.dateFormat, this.props.culture)}
                </Btn>
              </td>)
      })}
      </tr>
    )
  },

  _headers: function(format, culture){
    return [0,1,2,3,4,5,6].map( (day) => 
      <th key={"header_" + day }>{dates.format(day, format, culture)}</th>)
  }

});