import sys



from services.llm_service import LLMService


# function to convert streamed chunks into a single output
def convert_chunks_to_string(chunks: list) -> str:
    return "\n".join(chunks)

def get_total_code_steps(english_outline: str) -> int:
    return len(english_outline.split("#####")) - 1

# wrapper function around LLMService.run_prompt()
# modified output with streamed chunks converted to a single string
def run_prompt_wrapper(input, msg_type, step) -> str: # returns a list of chunks
    chunks = LLMService.run_prompt(input, msg_type, step)
    return convert_chunks_to_string(chunks)
        

# Run prompt chain using LLMService, using user input instead of frontend input (no need for WebSocket connection)
llm_service = LLMService()
    
initial_prompt = input("How can I help you today? Ask me a research question. ") # ASK USER FOR RESEARCH QUESTION

clarification_questions = run_prompt_wrapper(initial_prompt, "clarification", None)

clarification_answers = input("Please provide the clarifications to the questions asked: ") # ASK USER FOR CLARIFICATIONS

english_outline = run_prompt_wrapper(clarification_answers, "englishOutline", None)

looks_good = input("Does the English outline look good? (y/fix/explain)") # ASK USER IF ENGLISH OUTLINE LOOKS GOOD

if looks_good != "y":
    raise NotImplementedError("Explain/Fix feedback loop not yet implemented")

# extract max step from english outline
number_of_code_steps = get_total_code_steps(english_outline)

for i in range(1, number_of_code_steps):
    print(f"CODE STEP {i+1}:")
    run_prompt_wrapper(None, "codeStep", i) 
    looks_good = input(f"Continue to step {i}? (y/fix/explain)") # ASK USER IF CODE STEP LOOKS GOOD
    if looks_good != "y":
        raise NotImplementedError("Explain/Fix feedback loop not yet implemented")
    
final_code_step = run_prompt_wrapper(None, "finalCode", number_of_code_steps)    




