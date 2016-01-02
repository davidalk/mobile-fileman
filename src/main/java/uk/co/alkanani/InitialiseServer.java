package uk.co.alkanani;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.XmlWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

public class InitialiseServer {
    private static final Logger logger = LoggerFactory.getLogger(InitialiseServer.class);

    public static void main(String... args) {
        try {
            new InitialiseServer().startWebApp();
        } catch (Exception e) {
            logger.error("Error starting server", e);
            throw new RuntimeException(e);
        }
    }

    private void startWebApp() throws Exception {
        Server server = new Server(8080);
        server.setHandler(getServletContextHandler(new XmlWebApplicationContext()));
        server.start();
        server.join();
    }

    private ServletContextHandler getServletContextHandler(WebApplicationContext context) {
        ServletContextHandler contextHandler = new ServletContextHandler();
        contextHandler.setErrorHandler(null);
        contextHandler.setContextPath("/");
        contextHandler.addServlet(new ServletHolder(new DispatcherServlet(context)), "/*");
        contextHandler.addEventListener(new ContextLoaderListener(context));
        return contextHandler;
    }


}
