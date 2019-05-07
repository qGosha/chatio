export const normalizeNumber = value => {
  if (!value) {
    return value
  }

  const onlyNums = value.replace(/[^\d]/g, "")
  if (onlyNums.length <= 4) {
    return onlyNums
  }
}
