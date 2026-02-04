import React from 'react'

const VisuallyHiddenInput = React.forwardRef((props, ref) => (
  <input
    ref={ref}
    style={{
      position: 'absolute',
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: 'hidden',
      clip: 'rect(0,0,0,0)',
      border: 0
    }}
    {...props}
  />
))

VisuallyHiddenInput.displayName = 'VisuallyHiddenInput'

export default VisuallyHiddenInput
