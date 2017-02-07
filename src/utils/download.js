let saveAsFile = (fileName, data) => {
  let link = document.createElement('a')
  let blob = new window.Blob([data], { type: 'text/text;charset=utf-8;' })
  let url = window.URL.createObjectURL(blob)
  link.href = url
  link.setAttribute('download', fileName + '-modified.csv')
  link.click()
}

export { saveAsFile }
