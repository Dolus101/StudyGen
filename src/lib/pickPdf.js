import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy'; // SDK 54+. On older SDKs use: 'expo-file-system'

// Opens the system file picker and returns { uri, name, size } for a PDF
// that is safely stored inside the app's own document folder.
// Returns null if the user cancels. Throws an Error with a clear message on failure.
export async function pickPdf() {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/pdf',
    copyToCacheDirectory: false, // we do our own copy below (more reliable on Android)
    multiple: false,
  });

  if (result.canceled) return null;

  const asset = result.assets?.[0];
  if (!asset?.uri) throw new Error('No file was returned by the picker.');

  const name = asset.name || 'document.pdf';
  const dest = FileSystem.documentDirectory + `pick-${Date.now()}.pdf`;

  try {
    // Works for content:// URIs (Android) and file:// URIs
    await FileSystem.copyAsync({ from: asset.uri, to: dest });
  } catch (e) {
    throw new Error('Could not copy the PDF into the app: ' + (e?.message || e));
  }

  const info = await FileSystem.getInfoAsync(dest);
  if (!info.exists || !info.size) {
    throw new Error('The PDF was copied but it is empty. Try a different file or location.');
  }

  console.log('picked PDF', { uri: dest, name, size: info.size });
  return { uri: dest, name, size: info.size };
}