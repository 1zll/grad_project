package jp.careernote.service;

import jp.careernote.model.AppState;
import org.springframework.stereotype.Service;

@Service
public class AppStateService {
    private AppState state = AppState.demo();

    public synchronized AppState getState() {
        return state;
    }

    public synchronized AppState replaceState(AppState newState) {
        state = newState;
        return state;
    }
}
