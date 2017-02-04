let saveAsFile = (data, fileName = 'new-data.csv') => {
  let link = document.createElement('a')
  let blob = new window.Blob([data], { type: 'text/text;charset=utf-8;' })
  let url = window.URL.createObjectURL(blob)
  link.href = url
  link.setAttribute('download', fileName)
  link.click()
}

export { saveAsFile }
