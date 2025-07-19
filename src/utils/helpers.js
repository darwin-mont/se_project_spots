export function setBtnText(
  btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    btn.textContent = "Saving...";
  } else {
    btn.textContent = "Save";
  }
}
