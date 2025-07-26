const ActionHandler = {
  config: {
    highlight: {
      duration: 3000,
      style: {
        outline: '3px solid #ff6b6b',
        outlineOffset: '2px',
        transition: 'outline 0.2s ease-in-out',
      },
    },
    defaultStepDelay: 1000,
    validActions: ['highlight', 'click', 'focus', 'hover', 'move'],
    selectorTimeout: 5000,
    wandMoveDelay: 500,
  },

  async waitForElements(selector, text, timeout = this.config.selectorTimeout) {
    console.debug(`[ActionHandler] Waiting for elements with selector: "${selector || 'button, [role="button"], label'}"` + (text ? ` and text: "${text}"` : ''));
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      let elements = Array.from(document.querySelectorAll(selector || 'button, [role="button"], label'));
      if (text) {
        const textLower = text.toLowerCase().trim();
        elements = elements.filter(
          (el) => el.textContent.toLowerCase().trim().includes(textLower)
        );
      }
      if (elements.length > 0) {
        console.debug(`[ActionHandler] Found ${elements.length} element(s)`);
        return elements;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.warn(`[ActionHandler] No elements found after ${timeout}ms`);
    return [];
  },

  validateStep(step) {
    console.debug(`[ActionHandler] Validating step: ${JSON.stringify(step)}`);
    if (typeof step === 'string') {
      return { valid: true, normalized: { action: 'click', text: step } };
    }
    if (!step.action || !this.config.validActions.includes(step.action)) {
      console.error(`[ActionHandler] Invalid action: ${step.action}`);
      return { valid: false, error: `Invalid action: ${step.action}` };
    }
    if (!step.selector && !step.text) {
      console.error('[ActionHandler] Missing selector or text in step');
      return { valid: false, error: 'Missing selector or text' };
    }
    return { valid: true, normalized: step };
  },

  moveWandToElement(element, wandRef) {
    console.debug('[ActionHandler] Moving wand to element');
    if (!wandRef.current) return;
    const rect = element.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    const centerX = rect.left + scrollX + rect.width / 2;
    const centerY = rect.top + scrollY + rect.height / 2;

    wandRef.current.style.left = `${centerX - 16}px`;
    wandRef.current.style.top = `${centerY - 16}px`;
    console.debug(`[ActionHandler] Wand moved to: (${centerX}, ${centerY})`);
  },

  resetWand(wandRef) {
    if (!wandRef.current) return;
    wandRef.current.style.left = '10px';
    wandRef.current.style.top = `${window.innerHeight - 30}px`;
    wandRef.current.style.display = 'none';
    console.debug('[ActionHandler] Wand reset to bottom-left corner');
  },

  async highlightElement(selector, text, options = {}) {
    console.debug(`[ActionHandler] Highlighting elements with selector: "${selector || 'button, [role="button"], label'}"` + (text ? ` and text: "${text}"` : ''));
    const { duration = this.config.highlight.duration } = options;
    try {
      const elements = await this.waitForElements(selector, text);
      if (elements.length === 0) {
        console.warn(`[ActionHandler] No elements to highlight`);
        return { success: false, error: `No elements found` };
      }

      elements.forEach((element, index) => {
        console.debug(`[ActionHandler] Highlighting element ${index + 1}:`, element);
        const originalStyles = {
          outline: element.style.outline,
          outlineOffset: element.style.outlineOffset,
          transition: element.style.transition,
        };
        Object.assign(element.style, this.config.highlight.style);
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
          console.debug(`[ActionHandler] Restoring styles for element ${index + 1}:`, element);
          Object.assign(element.style, originalStyles);
        }, duration);
      });

      return { success: true, count: elements.length };
    } catch (err) {
      console.error(`[ActionHandler] Error highlighting element: ${err.message}`);
      return { success: false, error: `Error highlighting element: ${err.message}` };
    }
  },

  async clickElement(selector, text, wandRef) {
    console.debug(`[ActionHandler] Clicking elements with selector: "${selector || 'button, [role="button"], label'}"` + (text ? ` and text: "${text}"` : ''));
    try {
      const elements = await this.waitForElements(selector, text);
      if (elements.length === 0) {
        console.warn(`[ActionHandler] No elements to click`);
        return { success: false, error: `No elements found` };
      }

      for (const element of elements) {
        console.debug(`[ActionHandler] Processing click for element:`, element);
        this.moveWandToElement(element, wandRef);
        await new Promise(resolve => setTimeout(resolve, this.config.wandMoveDelay));

        const controlId = element.getAttribute('for');
        if (controlId) {
          const control = document.getElementById(controlId);
          if (control) {
            console.debug(`[ActionHandler] Clicking control with ID: ${controlId} for label`);
            const event = new MouseEvent('click', { bubbles: true, cancelable: true });
            control.dispatchEvent(event);
            continue;
          }
        }

        const wrappedInput = element.querySelector('input');
        if (wrappedInput) {
          console.debug(`[ActionHandler] Clicking wrapped input for element`);
          const event = new MouseEvent('click', { bubbles: true, cancelable: true });
          wrappedInput.dispatchEvent(event);
          continue;
        }

        console.debug(`[ActionHandler] Clicking element directly`);
        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        element.dispatchEvent(event);
      }

      return { success: true, count: elements.length };
    } catch (err) {
      console.error(`[ActionHandler] Error clicking element: ${err.message}`);
      return { success: false, error: `Error clicking element: ${err.message}` };
    }
  },

  async focusElement(selector, text) {
    console.debug(`[ActionHandler] Focusing element with selector: "${selector || 'button, [role="button"], label'}"` + (text ? ` and text: "${text}"` : ''));
    try {
      const elements = await this.waitForElements(selector, text);
      if (elements.length === 0) {
        console.warn(`[ActionHandler] No element to focus`);
        return { success: false, error: `No element found` };
      }
      const element = elements[0];
      console.debug('[ActionHandler] Focusing element:', element);
      element.focus();
      return { success: true };
    } catch (err) {
      console.error(`[ActionHandler] Error focusing element: ${err.message}`);
      return { success: false, error: `Error focusing element: ${err.message}` };
    }
  },

  async hoverElement(selector, text) {
    console.debug(`[ActionHandler] Hovering element with selector: "${selector || 'button, [role="button"], label'}"` + (text ? ` and text: "${text}"` : ''));
    try {
      const elements = await this.waitForElements(selector, text);
      if (elements.length === 0) {
        console.warn(`[ActionHandler] No element to hover`);
        return { success: false, error: `No element found` };
      }
      const element = elements[0];
      console.debug('[ActionHandler] Hovering element:', element);
      element.dispatchEvent(new Event('mouseover', { bubbles: true }));
      return { success: true };
    } catch (err) {
      console.error(`[ActionHandler] Error hovering element: ${err.message}`);
      return { success: false, error: `Error hovering element: ${err.message}` };
    }
  },

  async executeStep(step, wandRef) {
    const validation = this.validateStep(step);
    if (!validation.valid) {
      console.error(`[ActionHandler] Step validation failed: ${validation.error}`);
      return { success: false, error: validation.error };
    }

    const { action, selector, text, options = {} } = validation.normalized;
    console.debug(`[ActionHandler] Executing action: ${action}`);
    switch (action) {
      case 'highlight':
        return this.highlightElement(selector, text, options);
      case 'click':
        return this.clickElement(selector, text, wandRef);
      case 'focus':
        return this.focusElement(selector, text);
      case 'hover':
        return this.hoverElement(selector, text);
      case 'move':
        const elements = await this.waitForElements(selector, text);
        if (elements.length === 0) {
          console.warn(`[ActionHandler] No element to move to`);
          return { success: false, error: `No element found` };
        }
        this.moveWandToElement(elements[0], wandRef);
        await new Promise(resolve => setTimeout(resolve, this.config.wandMoveDelay));
        return { success: true };
      default:
        console.error(`[ActionHandler] Unsupported action: ${action}`);
        return { success: false, error: `Unsupported action: ${action}` };
    }
  },

  async processActions(steps, setMessages, delay = this.config.defaultStepDelay, wandRef) {
    console.debug(`[ActionHandler] Processing ${steps.length} action steps: ${JSON.stringify(steps)}`);
    if (!wandRef.current) return;
    wandRef.current.style.display = 'block';
    wandRef.current.style.left = '10px';
    wandRef.current.style.top = `${window.innerHeight - 30}px`;

    const results = [];
    for (const step of steps) {
      const result = await this.executeStep(step, wandRef);
      results.push(result);

      if (!result.success) {
        console.warn(`[ActionHandler] Action failed: ${result.error}`);
        setMessages((prev) => [
          ...prev,
          { text: `Action failed: ${result.error}`, sender: 'bot' },
        ]);
      } else {
        console.debug(`[ActionHandler] Action succeeded: affected ${result.count || 1} element(s)`);
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    console.debug(`[ActionHandler] Completed processing ${steps.length} steps with ${results.filter(r => r.success).length} successes`);
    this.resetWand(wandRef);
    return results;
  },
};

export default ActionHandler;
