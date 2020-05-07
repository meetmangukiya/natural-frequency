# natural-frequency

```node
> const { parse } = require('natural-frequency')
> parse('every 5 minutes')
{
  unit: 'minute',
  amount: 5,
  day: undefined,
  time: { hour: undefined, minute: undefined, amPm: undefined }
}
> parse('every monday at 10 23pm')
{
  unit: 'day',
  amount: 7,
  day: 'monday',
  time: { hour: 10, minute: 23, amPm: 'pm' }
}
```
