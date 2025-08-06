import * as core from '@actions/core'
import { installAndroidSdk } from './sdk-installer.js'
import {
  checkArch,
  checkChannel,
  checkDiskSize,
  checkEmulatorBuild,
  checkEnableHardwareKeyboard,
  checkForceAvdCreation,
  playstoreTargetSubstitution
} from './input-validator.js'
import { createAvd } from './emulator-manager.js'
import { getChannelId } from './channel-id-mapper.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    console.log(`::group::Configure emulator`)

    // API level of the platform and system image
    const apiLevel = core.getInput('api-level', { required: true })
    console.log(`API level: ${apiLevel}`)

    let systemImageApiLevel = core.getInput('system-image-api-level')
    if (!systemImageApiLevel) {
      systemImageApiLevel = apiLevel
    }
    console.log(`System image API level: ${systemImageApiLevel}`)

    // target of the system image
    const target = playstoreTargetSubstitution(core.getInput('target'))
    console.log(`target: ${target}`)

    // CPU architecture of the system image
    const arch = core.getInput('arch')
    checkArch(arch)
    console.log(`CPU architecture: ${arch}`)

    // Hardware profile used for creating the AVD
    const profile = core.getInput('profile')
    console.log(`Hardware profile: ${profile}`)

    // Number of cores to use for emulator
    const cores = core.getInput('cores')
    console.log(`Cores: ${cores}`)

    // RAM to use for AVD
    const ramSize = core.getInput('ram-size')
    console.log(`RAM size: ${ramSize}`)

    // Heap size to use for AVD
    const heapSize = core.getInput('heap-size')
    console.log(`Heap size: ${heapSize}`)

    // SD card path or size used for creating the AVD
    const sdcardPathOrSize = core.getInput('sdcard-path-or-size')
    console.log(`SD card path or size: ${sdcardPathOrSize}`)

    const diskSize = core.getInput('disk-size')
    checkDiskSize(diskSize)
    console.log(`Disk size: ${diskSize}`)

    // custom name used for creating the AVD
    const avdName = core.getInput('avd-name')
    console.log(`AVD name: ${avdName}`)

    // force AVD creation
    const forceAvdCreationInput = core.getInput('force-avd-creation')
    checkForceAvdCreation(forceAvdCreationInput)
    const forceAvdCreation = forceAvdCreationInput === 'true'
    console.log(`force avd creation: ${forceAvdCreation}`)

    // enable hardware keyboard
    const enableHardwareKeyboardInput = core.getInput('enable-hw-keyboard')
    checkEnableHardwareKeyboard(enableHardwareKeyboardInput)
    const enableHardwareKeyboard = enableHardwareKeyboardInput === 'true'
    console.log(`enable hardware keyboard: ${enableHardwareKeyboard}`)

    // emulator build
    const emulatorBuildInput = core.getInput('emulator-build')
    if (emulatorBuildInput) {
      checkEmulatorBuild(emulatorBuildInput)
      console.log(`using emulator build: ${emulatorBuildInput}`)
    }
    const emulatorBuild = !emulatorBuildInput ? undefined : emulatorBuildInput

    // version of NDK to install
    const ndkInput = core.getInput('ndk')
    if (ndkInput) {
      console.log(`version of NDK to install: ${ndkInput}`)
    }
    const ndkVersion = !ndkInput ? undefined : ndkInput

    // version of CMake to install
    const cmakeInput = core.getInput('cmake')
    if (cmakeInput) {
      console.log(`version of CMake to install: ${cmakeInput}`)
    }
    const cmakeVersion = !cmakeInput ? undefined : cmakeInput

    // channelId (up to and including) to download the SDK packages from
    const channelName = core.getInput('channel')
    checkChannel(channelName)
    const channelId = getChannelId(channelName)
    console.log(`Channel: ${channelId} (${channelName})`)

    console.log(`::endgroup::`)

    // install SDK
    await installAndroidSdk(
      apiLevel,
      systemImageApiLevel,
      target,
      arch,
      channelId,
      emulatorBuild,
      ndkVersion,
      cmakeVersion
    )

    // create AVD
    await createAvd(
      arch,
      avdName,
      cores,
      diskSize,
      enableHardwareKeyboard,
      forceAvdCreation,
      heapSize,
      profile,
      ramSize,
      sdcardPathOrSize,
      systemImageApiLevel,
      target
    )
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
