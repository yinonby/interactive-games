
import { __rnuiMocks } from '@ig/rnui';
import { buildMockedTranslation } from '@test/mocks/EngineAppUiMocks';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { WordleView, type WordleViewPropsT } from './WordleView';

describe('WordleView', () => {
  const { onShowSnackbarMock } = __rnuiMocks;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders exactly 2 full guess disabled inputs when 2 guesses are provided in wordleState', () => {
    const mockProps: WordleViewPropsT = {
      wordleExposeConfig: {
        langCode: 'en',
        wordLength: 5,
        allowedGuessesNum: 3,
      },
      wordleState: {
        guessDatas: [
          { guess: 'HELLO', letterAnalyses: ['hit', 'hit', 'hit', 'hit', 'hit'] },
          { guess: 'WORLD', letterAnalyses: ['notPresent', 'present', 'hit', 'notPresent', 'notPresent'] },
        ],
        correctSolution: 'HELLO',
      },
      levelStatus: 'levelInProcess',
      onSubmitGuess: jest.fn(),
    };

    const { getAllByTestId } = render(<WordleView {...mockProps} />);

    // verify components
    const fullGuessInputs = getAllByTestId('RnuiCodeInput-full-tid');
    expect(fullGuessInputs).toHaveLength(2);
  });

  it('does not render code input and button, when level is not in process', () => {
    const mockProps: WordleViewPropsT = {
      wordleExposeConfig: {
        langCode: 'en',
        wordLength: 5,
        allowedGuessesNum: 3,
      },
      wordleState: {
        guessDatas: [
          { guess: 'HELLO', letterAnalyses: ['hit', 'hit', 'hit', 'hit', 'hit'] },
          { guess: 'WORLD', letterAnalyses: ['notPresent', 'present', 'hit', 'notPresent', 'notPresent'] },
        ],
        correctSolution: 'HELLO',
      },
      levelStatus: 'notStarted',
      onSubmitGuess: jest.fn(),
    };

    const { queryByTestId } = render(<WordleView {...mockProps} />);

    // verify components
    expect(queryByTestId('RnuiCodeInput-input-tid')).toBeNull();
    expect(queryByTestId('RnuiButton-submit-tid')).toBeNull();
  });

  it('does not render code input and button, when level is in process but no guesses are left', () => {
    const mockProps: WordleViewPropsT = {
      wordleExposeConfig: {
        langCode: 'en',
        wordLength: 5,
        allowedGuessesNum: 3,
      },
      wordleState: {
        guessDatas: [
          { guess: 'HELLO', letterAnalyses: ['hit', 'hit', 'hit', 'hit', 'hit'] },
          { guess: 'WORLD', letterAnalyses: ['notPresent', 'present', 'hit', 'notPresent', 'notPresent'] },
          { guess: 'WORLD', letterAnalyses: ['notPresent', 'present', 'hit', 'notPresent', 'notPresent'] },
        ],
        correctSolution: 'HELLO',
      },
      levelStatus: 'levelInProcess',
      onSubmitGuess: jest.fn(),
    };

    const { queryByTestId } = render(<WordleView {...mockProps} />);

    // verify components
    expect(queryByTestId('RnuiCodeInput-input-tid')).toBeNull();
    expect(queryByTestId('RnuiButton-submit-tid')).toBeNull();
  });

  it('renders code input and button, when level is in process and guesses are left, solution is correct', async () => {
    // setup mocks
    const onSubmitGuessMock = jest.fn();
    onSubmitGuessMock.mockReturnValue(true);

    // render
    const mockProps: WordleViewPropsT = {
      wordleExposeConfig: {
        langCode: 'en',
        wordLength: 5,
        allowedGuessesNum: 3,
      },
      wordleState: {
        guessDatas: [
          { guess: 'HELLO', letterAnalyses: ['hit', 'hit', 'hit', 'hit', 'hit'] },
          { guess: 'WORLD', letterAnalyses: ['notPresent', 'present', 'hit', 'notPresent', 'notPresent'] },
        ],
        correctSolution: 'HELLO',
      },
      levelStatus: 'levelInProcess',
      onSubmitGuess: onSubmitGuessMock,
      snackbarDurationMs: 3000,
    };

    const { getByTestId } = render(<WordleView {...mockProps} />);

    // verify components
    const guessInput = getByTestId('RnuiCodeInput-input-tid');
    const submitButton = getByTestId('RnuiButton-submit-tid');
    expect(submitButton.props.disabled).toEqual(true);

    // Simulate typing 'ABCDE'
    fireEvent(guessInput, 'onChange', 'ABCDE');

    // Ensure the button is no longer disabled (length matches wordLength: 5)
    expect(submitButton.props.disabled).toBe(false);

    // Simulate pressing the submit button
    fireEvent.press(submitButton);

    // Verify the callback was triggered with the correct value
    await waitFor(() => {
      expect(onSubmitGuessMock).toHaveBeenCalledWith('ABCDE');
    });

    // Verify the input was reset after submission
    expect(guessInput.props.value).toBe('');

    expect(onShowSnackbarMock)
      .toHaveBeenCalledWith({
        message: buildMockedTranslation('common:solutionCorrect'),
        level: 'info',
        durationMs: 3000,
        withCloseButton: true,
      });
  });

  it('renders code input and button, when level is in process and guesses are left, solution incorrect', async () => {
    // setup mocks
    const onSubmitGuessMock = jest.fn();
    onSubmitGuessMock.mockReturnValue(false);

    // render
    const mockProps: WordleViewPropsT = {
      wordleExposeConfig: {
        langCode: 'en',
        wordLength: 5,
        allowedGuessesNum: 3,
      },
      wordleState: {
        guessDatas: [
          { guess: 'HELLO', letterAnalyses: ['hit', 'hit', 'hit', 'hit', 'hit'] },
          { guess: 'WORLD', letterAnalyses: ['notPresent', 'present', 'hit', 'notPresent', 'notPresent'] },
        ],
        correctSolution: 'HELLO',
      },
      levelStatus: 'levelInProcess',
      onSubmitGuess: onSubmitGuessMock,
      snackbarDurationMs: 3000,
    };

    const { getByTestId } = render(<WordleView {...mockProps} />);

    // verify components
    const guessInput = getByTestId('RnuiCodeInput-input-tid');
    const submitButton = getByTestId('RnuiButton-submit-tid');
    expect(submitButton.props.disabled).toEqual(true);

    // Simulate typing 'ABCDE'
    fireEvent(guessInput, 'onChange', 'ABCDE');

    // Ensure the button is no longer disabled (length matches wordLength: 5)
    expect(submitButton.props.disabled).toBe(false);

    // Simulate pressing the submit button
    fireEvent.press(submitButton);

    // Verify the callback was triggered with the correct value
    await waitFor(() => {
      expect(onSubmitGuessMock).toHaveBeenCalledWith('ABCDE');
    });

    // Verify the input was reset after submission
    expect(guessInput.props.value).toBe('');

    expect(onShowSnackbarMock)
      .toHaveBeenCalledWith({
        message: buildMockedTranslation('common:solutionIncorrect'),
        level: 'warn',
        durationMs: 3000,
        withCloseButton: true,
      });
  });

  it('does not render empty disabled code inputs, when level is not in process', () => {
    const mockProps: WordleViewPropsT = {
      wordleExposeConfig: {
        langCode: 'en',
        wordLength: 5,
        allowedGuessesNum: 4,
      },
      wordleState: {
        guessDatas: [
          { guess: 'HELLO', letterAnalyses: ['hit', 'hit', 'hit', 'hit', 'hit'] },
        ],
        correctSolution: 'HELLO',
      },
      levelStatus: 'notStarted',
      onSubmitGuess: jest.fn(),
    };

    const { queryByTestId } = render(<WordleView {...mockProps} />);

    // verify components
    expect(queryByTestId('RnuiCodeInput-empty-tid')).toBeNull();
  });

  it('does not render empty disabled code inputs, when level in process but not more than 1 guess are left', () => {
    const mockProps: WordleViewPropsT = {
      wordleExposeConfig: {
        langCode: 'en',
        wordLength: 5,
        allowedGuessesNum: 3,
      },
      wordleState: {
        guessDatas: [
          { guess: 'HELLO', letterAnalyses: ['hit', 'hit', 'hit', 'hit', 'hit'] },
          { guess: 'WORLD', letterAnalyses: ['notPresent', 'present', 'hit', 'notPresent', 'notPresent'] },
        ],
        correctSolution: 'HELLO',
      },
      levelStatus: 'levelInProcess',
      onSubmitGuess: jest.fn(),
    };

    const { queryByTestId } = render(<WordleView {...mockProps} />);

    // verify components
    expect(queryByTestId('RnuiCodeInput-empty-tid')).toBeNull();
  });

  it('renders empty disabled code inputs, when level is in process and more than 1 guess are left', () => {
    const mockProps: WordleViewPropsT = {
      wordleExposeConfig: {
        langCode: 'en',
        wordLength: 5,
        allowedGuessesNum: 4,
      },
      wordleState: {
        guessDatas: [
          { guess: 'HELLO', letterAnalyses: ['hit', 'hit', 'hit', 'hit', 'hit'] },
        ],
        correctSolution: 'HELLO',
      },
      levelStatus: 'levelInProcess',
      onSubmitGuess: jest.fn(),
    };

    const { getAllByTestId } = render(<WordleView {...mockProps} />);

    // verify components
    const guessInputs = getAllByTestId('RnuiCodeInput-empty-tid');
    expect(guessInputs).toHaveLength(2);
  });

  it('does not render guessLeft text, when level is not in process', () => {
    const mockProps: WordleViewPropsT = {
      wordleExposeConfig: {
        langCode: 'en',
        wordLength: 5,
        allowedGuessesNum: 4,
      },
      wordleState: {
        guessDatas: [
          { guess: 'HELLO', letterAnalyses: ['hit', 'hit', 'hit', 'hit', 'hit'] },
        ],
        correctSolution: 'HELLO',
      },
      levelStatus: 'solved',
      onSubmitGuess: jest.fn(),
    };

    const { queryByText } = render(<WordleView {...mockProps} />);

    // verify components
    expect(queryByText(buildMockedTranslation('games:guessesLeft'))).toBeNull();
  });

  it('renders guessLeft text, when level is in process', () => {
    const mockProps: WordleViewPropsT = {
      wordleExposeConfig: {
        langCode: 'en',
        wordLength: 5,
        allowedGuessesNum: 4,
      },
      wordleState: {
        guessDatas: [
          { guess: 'HELLO', letterAnalyses: ['hit', 'hit', 'hit', 'hit', 'hit'] },
        ],
        correctSolution: 'HELLO',
      },
      levelStatus: 'levelInProcess',
      onSubmitGuess: jest.fn(),
    };

    const { getByText } = render(<WordleView {...mockProps} />);

    // verify components
    getByText(buildMockedTranslation('games:guessesLeft'));
  });

  it('does not render correct solution text, when level is not solved', () => {
    const mockProps: WordleViewPropsT = {
      wordleExposeConfig: {
        langCode: 'en',
        wordLength: 5,
        allowedGuessesNum: 4,
      },
      wordleState: {
        guessDatas: [
          { guess: 'HELLO', letterAnalyses: ['hit', 'hit', 'hit', 'hit', 'hit'] },
        ],
        correctSolution: 'HELLO',
      },
      levelStatus: 'levelInProcess',
      onSubmitGuess: jest.fn(),
    };

    const { queryByText } = render(<WordleView {...mockProps} />);

    // verify components
    expect(queryByText(buildMockedTranslation('common:solution') + ':')).toBeNull();
    expect(queryByText('HELLO')).toBeNull();
  });

  it('does not render correct solution text, when level is solved, but solution is not given', () => {
    const mockProps: WordleViewPropsT = {
      wordleExposeConfig: {
        langCode: 'en',
        wordLength: 5,
        allowedGuessesNum: 4,
      },
      wordleState: {
        guessDatas: [
          { guess: 'HELLO', letterAnalyses: ['hit', 'hit', 'hit', 'hit', 'hit'] },
        ],
      },
      levelStatus: 'solved',
      onSubmitGuess: jest.fn(),
    };

    const { queryByText } = render(<WordleView {...mockProps} />);

    // verify components
    expect(queryByText(buildMockedTranslation('common:solution') + ':')).toBeNull();
    expect(queryByText('HELLO')).toBeNull();
  });

  it('renders correct solution text, when level is solved and solution is given', () => {
    const mockProps: WordleViewPropsT = {
      wordleExposeConfig: {
        langCode: 'en',
        wordLength: 5,
        allowedGuessesNum: 4,
      },
      wordleState: {
        guessDatas: [
          { guess: 'HELLO', letterAnalyses: ['hit', 'hit', 'hit', 'hit', 'hit'] },
        ],
        correctSolution: 'HELLO',
      },
      levelStatus: 'solved',
      onSubmitGuess: jest.fn(),
    };

    const { getByText } = render(<WordleView {...mockProps} />);

    // verify components
    getByText(buildMockedTranslation('common:solution') + ':');
    getByText('HELLO');
  });
});
