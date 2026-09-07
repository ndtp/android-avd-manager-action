/**
 * Unit tests for src/input-validator.ts
 */
import { systemImageTag } from '../src/input-validator.js'

describe('systemImageTag', () => {
  it('leaves a regular target alone', () => {
    expect(systemImageTag('google_apis')).toBe('google_apis')
    expect(systemImageTag('default')).toBe('default')
    expect(systemImageTag('google_apis_playstore')).toBe(
      'google_apis_playstore'
    )
  })

  it('drops the _ps16k package suffix to get the tag', () => {
    expect(systemImageTag('google_apis_ps16k')).toBe('google_apis')
    expect(systemImageTag('google_apis_playstore_ps16k')).toBe(
      'google_apis_playstore'
    )
  })

  it('only strips the suffix, not a match elsewhere in the name', () => {
    expect(systemImageTag('ps16k_google_apis')).toBe('ps16k_google_apis')
  })

  it('is idempotent', () => {
    expect(systemImageTag(systemImageTag('google_apis_ps16k'))).toBe(
      'google_apis'
    )
  })
})
