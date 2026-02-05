
import { useAppLocalization, useGenericStyles } from '@ig/app-engine-ui';
import type { LevelStatusT } from '@ig/games-engine-models';
import type { LetterAnalysisT, WordleExposedConfigT, WordleStateT } from '@ig/games-wordle-models';
import { RnuiButton, RnuiCodeInput, RnuiText, TestableComponentT, useRnuiSnackbar } from '@ig/rnui';
import React, { useState, type FC } from 'react';
import { View, type ColorValue } from 'react-native';

const letterAnalysisToBackgroundColor: Record<LetterAnalysisT, ColorValue> = {
  'hit': '#4caf50',
  'present': '#ff9100',
  'notPresent': '#ff3d00',
}

export type WordleViewPropsT = TestableComponentT & {
  wordleExposeConfig: WordleExposedConfigT,
  wordleState: WordleStateT,
  levelStatus: LevelStatusT,
  onSubmitGuess: (guess: string) => Promise<boolean>,
  snackbarDurationMs?: number;
};

export const WordleView: FC<WordleViewPropsT> = (props) => {
  const { wordleExposeConfig, wordleState, levelStatus, onSubmitGuess, snackbarDurationMs = 5000 } = props;
  const { t } = useAppLocalization();
  const { onShowSnackbar } = useRnuiSnackbar();
  const genericStyles = useGenericStyles();
  const [guess, setGuess] = useState('');
  const isGuessSubmittable = guess.length === wordleExposeConfig.wordLength;
  const guessesLeft = wordleExposeConfig.allowedGuessesNum - wordleState.guessDatas.length;

  const handleInputChange = async (input: string): Promise<void> => {
    setGuess(input);
  }

  const handleSubmit = async (): Promise<void> => {
    const isCorrectGuess = await onSubmitGuess(guess);

    // reset guess
    setGuess('');

    // show snackbar
    onShowSnackbar({
      message: isCorrectGuess ? t('common:solutionCorrect') : t('common:solutionIncorrect'),
      level: isCorrectGuess ? 'info' : 'warn',
      durationMs: snackbarDurationMs,
      withCloseButton: true,
    });
  }

  return (
    <View style={genericStyles.spacing}>
      {wordleState.guessDatas.map((e, index) =>
        <View key={index} style={genericStyles.flexRow}>
          <RnuiCodeInput
            testID='RnuiCodeInput-full-tid'
            length={wordleExposeConfig.wordLength}
            value={e.guess}
            size='small'
            tileTextColors={e.letterAnalyses.map(() => 'white')}
            tileBackgroundColors={e.letterAnalyses.map(e => letterAnalysisToBackgroundColor[e])}
            disabled
          />
        </View>
      )}

      {levelStatus === 'levelInProcess' && guessesLeft > 0 &&
        <View style={genericStyles.flexRow}>
          <RnuiCodeInput
            testID='RnuiCodeInput-input-tid'
            length={wordleExposeConfig.wordLength}
            value={guess}
            onChange={handleInputChange}
            size='small'
          />

          <RnuiButton
            testID='RnuiButton-submit-tid'
            mode='contained'
            size='small'
            onPress={handleSubmit}
            disabled={!isGuessSubmittable}
          >
            {t('common:submit')}
          </RnuiButton>
        </View>
      }

      {levelStatus === 'levelInProcess' && guessesLeft > 1 && [...Array(guessesLeft - 1).keys()].map((e, index) =>
        <View key={index} style={genericStyles.flexRow}>
          <RnuiCodeInput
            testID='RnuiCodeInput-empty-tid'
            length={wordleExposeConfig.wordLength}
            size='small'
            disabled
          />
        </View>
      )}

      {levelStatus === 'levelInProcess' &&
        <RnuiText testID='chat-title-tid' variant='titleSmall'>
          {t('games:guessesLeft', { count: guessesLeft, guessesNum: guessesLeft})}
        </RnuiText>
      }

      {levelStatus === 'solved' && wordleState.correctSolution &&
        <View style={[genericStyles.flexRow, genericStyles.spacing]}>
          <RnuiText testID='chat-title-tid' variant='titleSmall'>{t('common:solution') + ":"}</RnuiText>
          <RnuiText testID='chat-title-tid' variant='titleSmall'>{wordleState.correctSolution}</RnuiText>
        </View>
      }
    </View>
  );
};
