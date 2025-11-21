/**
 * URLInput Component
 * 
 * TODO: Students should implement:
 * 1. Create state for URL input field
 * 2. Create state for loading/submission status
 * 3. Implement form submission handler
 * 4. Call submitUrl from the api service
 * 5. Handle success/error responses
 * 6. Implement form validation (basic URL validation)
 * 7. Clear input after successful submission
 * 8. Display user-friendly feedback messages
 */

interface URLInputProps {
  onSubmit?: (url: string) => void;
}

export default function URLInput({ onSubmit }: URLInputProps) {
  return (
    <div>
      <h2>Add URL to Reading List</h2>
      
      {/* TODO: Implement the form structure here */}
      {/* TODO: Create input field for URL */}
      {/* TODO: Create submit button */}
      {/* TODO: Display loading spinner during submission */}
      {/* TODO: Display error messages if submission fails */}
      
      <form>
        <input 
          type="url" 
          placeholder="Enter URL..." 
          // TODO: Add onChange handler
          // TODO: Add value binding
        />
        <button type="submit">
          {/* TODO: Show "Loading..." when submitting */}
          Submit URL
        </button>
      </form>
    </div>
  )
}
