#!/usr/bin/env python3
import os
import textwrap

def file_dir():
  return os.path.dirname(os.path.realpath(__file__))

def read_file(filename):
    '''
    Reads the specified file.

    :param filename: The file to read
    :return: The content of the specified file
    '''
    if os.path.exists(filename):
        with open(filename, "r") as file:
            return file.read()
    else:
        raise IOError("file {} not found.".format(filename))

def write_file(filename, text):
    '''
    Writes the specified text to the specified file.

    :param filename: The file to write to
    :param text: The text to write
    '''
    with open(filename, "w") as file:
        file.write(text)

def fix_android_assets():
  print("Fixing android error with duplicate assets: https://github.com/facebook/react-native/issues/22234")

  gradle_file_path = "{}/node_modules/react-native/react.gradle".format(file_dir())

  code_snippet = textwrap.indent("""\
            // Added by post_install
            // Fix for: https://github.com/facebook/react-native/issues/22234
            doLast {
                def moveFunc = { resSuffix ->
                    File originalDir = file("$buildDir/generated/res/react/release/drawable-${resSuffix}");
                    if (originalDir.exists()) {
                        File destDir = file("$buildDir/../src/main/res/drawable-${resSuffix}");
                        ant.move(file: originalDir, tofile: destDir);
                    }
                }
                moveFunc.curry("ldpi").call()
                moveFunc.curry("mdpi").call()
                moveFunc.curry("hdpi").call()
                moveFunc.curry("xhdpi").call()
                moveFunc.curry("xxhdpi").call()
                moveFunc.curry("xxxhdpi").call()
            }
  """, "")

  text = read_file(gradle_file_path)

  start = text.find("doFirst", 0)
  end = text.find("}", start)
  end = text.find("\n", end) + 1
  
  text = text[:end] + code_snippet + text[end:]

  write_file(gradle_file_path, text)

def main():
    fix_android_assets()

if __name__ == "__main__":
    main()
