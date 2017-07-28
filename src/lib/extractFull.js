import path from 'path'
import when from 'when'
import * as u from '../util'

/**
 * Extract an archive with full paths.
 * @promise ExtractFull
 * @param {string} archive Path to the archive.
 * @param {string} dest Destination.
 * @param options {Object} An object of acceptable options to 7za bin.
 * @resolve {array} Arguments passed to the child-process.
 * @progress {array} Extracted files and directories.
 * @reject {Error} The error as issued by 7-Zip.
 */
export default function (archive, dest, { exePath, ...options } = {}) {
  return when.promise(function (resolve, reject, progress) {

    // Create a string that can be parsed by `run`.
    let command = exePath ? exePath : (/(rar)$/i.test(archive))? '7z' : '7za'
    command += ' x -r -y -bsp1 "' + archive + '" -o"' + dest + '" '
    //   recursive-^   |    ^--- This makes it print the progress to node
    //                  °.. Always assume "yes" (to overwrite and stuff)
    
    // Start the command
    u.run(command, options)

    // When a stdout is emitted, parse each line and search for a pattern. When
    // the pattern is found, extract the file (or directory) name from it and
    // pass it to an array. Finally returns this array.
    .progress(function (data) {
      
      // Examples of a line returned by 7za
      // > Some random intro
      // > 28% 1318 - Some path\with\a\file.extension

      var entries = []
      
      // Check if the line contains a status update
      var statusline = /\d{1,3}\b%.*/.exec(data); 
      if (statusline) {
        // Extract the progress
        // TODO: Return this progress directly instead of the progress() abstraction
        // I just didn't want to mess with the rest of your code.
        var progress = statusline[0].split("%")[0];
        
        // Extract the path
        var pathline = /- (.)*/.exec(line);
        if (pathline) {
            var filepath = pathline[0].substring(2);
            entries.push(filepath);
        }
      }
      
      // If I were you, I'd return an object like this
      /*
      var ret = {
        progress,
        // TODO: Add filecount (sorry dude, I'm too lazy for that)
        filepath
      }
      */
      return progress(entries)
    })

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
