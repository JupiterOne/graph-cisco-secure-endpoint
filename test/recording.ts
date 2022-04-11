import {
  mutations,
  Recording,
  setupRecording,
  SetupRecordingInput,
} from '@jupiterone/integration-sdk-testing';

export function setupCiscoAmpRecording(
  input: Omit<SetupRecordingInput, 'mutateEntry'>,
): Recording {
  return setupRecording({
    ...input,
    mutateEntry: (entry) => {
      mutations.unzipGzippedRecordingEntry(entry);
      redact(entry);
    },
  });
}

function redact(entry): void {
  // There is not anything to redact yet, but if something need to be redacted
  // it can be done here
  // Example: https://github.com/JupiterOne/graph-rumble/blob/578a5352724d880fdc315a9419f3cd53261154f5/test/recording.ts#L21
  return;
}
