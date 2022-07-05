import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import SignUpPage from "./SignUpPage";
// import "./locale/i18n";
// import en from "./locale/en.json"


describe("Sign up page", () => {
  describe("Layout", () => {

    it("has header", () => {
      render(<SignUpPage />);
      const header = screen.queryByRole("heading", { name: "Sign Up"});
      expect(header).toBeInTheDocument();
    });
    it("has username input", () => {
      render(<SignUpPage />);
      const inputElement = screen.getByLabelText("User name");
      expect(inputElement).toBeInTheDocument();
    });
    it("has email input", () => {
      render(<SignUpPage />);
      const inputElement = screen.getByLabelText("Email");
      expect(inputElement).toBeInTheDocument();
    });
    it("has pasword input", () => {
      render(<SignUpPage />);
      const inputElement = screen.getByLabelText("Password");
      expect(inputElement).toBeInTheDocument();
    });
    it("has pasword type for password input", () => {
      render(<SignUpPage />);
      const inputElement = screen.getByLabelText("Password");
      expect(inputElement.type).toBe("password");
    });
    it("has pasword repeat input", () => {
      render(<SignUpPage />);
      const inputElement = screen.getByLabelText("Password repeat");
      expect(inputElement).toBeInTheDocument();
    });
    it("has pasword type for password repeat input", () => {
      render(<SignUpPage />);
      const inputElement = screen.getByLabelText("Password repeat");
      expect(inputElement.type).toBe("password");
    });
    it("has Sign up button", () => {
      render(<SignUpPage />);
      const button = screen.queryByRole("button", { name: "Sign up" });
      expect(button).toBeInTheDocument();
    });
    it("disables the button initially", () => {
      render(<SignUpPage />);
      const button = screen.queryByRole("button", { name: "Sign up" });
      expect(button).toBeDisabled();
    });

    describe("interactions", () => {
      let requestBody;
      let counter = 0;
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          requestBody = req.body;
          counter += 1;
          return res(ctx.status(200));
        })
      );
      beforeEach(() => {
        counter = 0;
        server.resetHandlers();
      });
      beforeAll(() => server.listen());
      afterAll(() => server.close);
      let button, passwordInputElement, passwordRepeatInputElement;
      const setup = () => {
        render(<SignUpPage />);
        const usernameInputElement = screen.getByLabelText("User name");
        const emaiInputElement = screen.getByLabelText("Email");
        const passwordInputElement = screen.getByLabelText("Password");
        const passwordRepeatInputElement =
          screen.getByLabelText("Password repeat");
        userEvent.type(usernameInputElement, "user1");
        userEvent.type(emaiInputElement, "user1@mail.com");
        userEvent.type(passwordInputElement, "P4ssword");
        userEvent.type(passwordRepeatInputElement, "P4ssword");
        button = screen.queryByRole("button", { name: "Sign up" });
      };
      it("enables the buttton when password and password repeat fields have same values", () => {
        setup();
        expect(button).toBeEnabled();
      });
      it("sends username, email and password to backend after clicking the SignUp Button", async () => {
        setup();

        userEvent.click(button);

        await screen.findByText(
          "Please check you email to activate your account"
        );

        expect(requestBody).toEqual({
          username: "user1",
          email: "user1@mail.com",
          password: "P4ssword",
        });
      });

      it("disables button when there is an ongoing api call", async () => {
        setup();

        userEvent.click(button);
        userEvent.click(button);

        await screen.findByText(
          "Please check you email to activate your account"
        );

        expect(counter).toBe(1);
      });
      it("displays spinner after clicking the submit button", async () => {
        setup();

        expect(
          screen.queryByRole("status", { hidden: true })
        ).not.toBeInTheDocument();

        userEvent.click(button);
        const spinner = screen.getByRole("status", { hidden: true });
        expect(spinner).toBeInTheDocument();
        await screen.findByText(
          "Please check you email to activate your account"
        );
      });

      it("displays account activation notification after successfull sign up request", async () => {
        setup();
        const message = "Please check you email to activate your account";
        expect(screen.queryByText(message)).not.toBeInTheDocument();
        userEvent.click(button);
        const text = await screen.findByText(message);
        expect(text).toBeInTheDocument();
      });
      it("hides SignUp form after succcessful sign up request", async () => {
        setup();
        const form = screen.getByTestId(/form-sign-up/i);
        userEvent.click(button);
        await waitFor(() => {
          expect(form).not.toBeInTheDocument();
        });
      });
      const generateValidationError = (field, message) => {
        return rest.post("/api/1.0/users", (req, res, ctx) => {
          requestBody = req.body;
          counter += 1;
          return res(
            ctx.status(400),
            ctx.json({
              validationErrors: { [field]: message },
            })
          );
        });
      };
      it.each`
        field         | message 
        ${"username"} | ${"Username cannot be null"} 
        ${"email"}    | ${"E-mail cannot be null"} 
        ${"password"} | ${"Password cannot be null"} 
      `("Clears validation error after $field is updated", async ({ field, message , label}) => {
        server.use(generateValidationError(field, message));
        setup();
        userEvent.click(button);
        const validationError = await screen.findByText(message);
        expect(validationError).toBeInTheDocument();
      });

      it("hides spinner and enables button after response received", async () => {
        server.use(
          generateValidationError("username", "Username cannot be null")
        );
        setup();
        userEvent.click(button);
        await screen.findByText("Username cannot be null");
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
        expect(button).toBeEnabled();
      });

      xit("displays mismatch message for password repeat input", () => {
          setup();
          userEvent.type(passwordInputElement, "P4ssword");
          userEvent.type(passwordRepeatInputElement, "AnotherP4ssword");
          const validationError = screen.getByTestId("span").toContain("Password mismatch");
          expect(validationError).toBeInTheDocument();
        });   
        
        it.each`
        field         | message                      | label
        ${"username"} | ${"Username cannot be null"} | ${"User name"}
        ${"email"}    | ${"E-mail cannot be null"}   | ${"Email"}
        ${"password"} | ${"Password cannot be null"} | ${"Password"}
      `("displays $message for $field", async ({ field, message, label}) => {
        server.use(generateValidationError(field, message));
        setup();
        userEvent.click(button);
        const validationError = await screen.findByText(message);

        userEvent.type(screen.getByLabelText(label), "Updated");
        expect(validationError).not.toBeInTheDocument();
      });
    });
  });
});
