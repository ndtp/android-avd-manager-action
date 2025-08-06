import * as exec from '@actions/exec'
import * as fs from 'fs'

/**
 * Creates a new AVD instance with the specified configurations.
 */
export async function createAvd(
  arch: string,
  avdName: string,
  cores: string,
  diskSize: string,
  enableHardwareKeyboard: boolean,
  forceAvdCreation: boolean,
  heapSize: string,
  profile: string,
  ramSize: string,
  sdcardPathOrSize: string,
  systemImageApiLevel: string,
  target: string
): Promise<void> {
  try {
    console.log(`::group::Create AVD`)
    // create a new AVD if AVD directory does not already exist or forceAvdCreation is true
    const avdPath = `${process.env.ANDROID_AVD_HOME}/${avdName}.avd`
    if (!fs.existsSync(avdPath) || forceAvdCreation) {
      const profileOption = profile.trim() !== '' ? `--device '${profile}'` : ''
      const sdcardPathOrSizeOption =
        sdcardPathOrSize.trim() !== '' ? `--sdcard '${sdcardPathOrSize}'` : ''
      console.log(`Creating AVD.`)
      await exec.exec(
        `sh -c \\"echo no | avdmanager create avd --force -n "${avdName}" --abi '${target}/${arch}' --package 'system-images;android-${systemImageApiLevel};${target};${arch}' ${profileOption} ${sdcardPathOrSizeOption}"`
      )
    }

    if (cores || ramSize || heapSize || enableHardwareKeyboard || diskSize) {
      const configEntries: string[] = []

      if (cores) {
        configEntries.push(`hw.cpu.ncore=${cores}`)
      }
      if (ramSize) {
        configEntries.push(`hw.ramSize=${ramSize}`)
      }
      if (heapSize) {
        configEntries.push(`hw.heapSize=${heapSize}`)
      }
      if (enableHardwareKeyboard) {
        configEntries.push('hw.keyboard=yes')
      }
      if (diskSize) {
        configEntries.push(`disk.dataPartition.size=${diskSize}`)
      }

      if (configEntries.length > 0) {
        const configContent = configEntries.join('\\n') + '\\n'
        await exec.exec(
          `sh -c \\"printf '${configContent}' >> ${process.env.ANDROID_AVD_HOME}/"${avdName}".avd"/config.ini"`
        )
      }
    }
  } finally {
    console.log(`::endgroup::`)
  }
}
