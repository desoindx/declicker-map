export const selectStyles = {
  control: (provided: any) => ({
    ...provided,
    border: 'none',
    boxShadow: 'none',
    cursor: 'pointer',
    margin: 'auto',
    maxWidth: '500px',
  }),
  menuList: (provided: any) => ({
    ...provided,
    backgroundColor: 'white',
    color: 'black',
  }),
  option: (provided: any, state: any) => {
    if (state.isFocused) {
      return { ...provided, cursor: 'pointer', backgroundColor: '#c8c8c8' }
    }
    return { ...provided, cursor: 'pointer' }
  },
}
