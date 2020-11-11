import when from 'when'
import * as u from '../util'

/**
 * Delete content to an archive.
 * @promise Delete
 * @param archive {string} Path to the archive.
 * @param files {string|array} Files to delete.
 * @param options {Object} An object of acceptable options to 7za bin.
 * @resolve {array} Arguments passed to the child-process.
 * @reject {Error} The error as issued by 7-Zip.
 */
export default function (archive, files, { exePath, ...options } = {}) {
  return when.promise(function (resolve, reject) {

    // Convert array of files into a string if needed.
    files = u.files(files)

    // Create a string that can be parsed by `run`.
    let command = exePath ? exePath : (/(rar)$/i.test(archive))? '7z' : '7za'
    command += ' d "' + archive + '" ' + files

    // Start the command
    u.run(command, options)

    // When all is done resolve the Promise.
    .then(function (args) {
      return resolve(args)
    })

    // Catch the error and pass it to the reject function of the Promise.
    .catch(function (err) {
      return reject(err)
    })

  })
}
