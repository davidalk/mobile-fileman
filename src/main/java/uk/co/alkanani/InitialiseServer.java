package uk.co.alkanani;

import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.DefaultHandler;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.server.handler.gzip.GzipHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.XmlWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import java.io.IOException;

public class InitialiseServer {
    private static final Logger logger = LoggerFactory.getLogger(InitialiseServer.class);

    private InitialiseServer() {}

    public static void main(String... args) {
        try {
            InitialiseServer initialiseServer = new InitialiseServer();
            initialiseServer.startWebApp();
            initialiseServer.startStaticServer();
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

    private ServletContextHandler getServletContextHandler(WebApplicationContext context) throws IOException {
        ServletContextHandler contextHandler = new ServletContextHandler();
        contextHandler.setErrorHandler(null);
        contextHandler.setContextPath("/");
        contextHandler.addServlet(new ServletHolder(new DispatcherServlet(context)), "/*");
        contextHandler.addEventListener(new ContextLoaderListener(context));
        contextHandler.setResourceBase(new ClassPathResource("webapp").getURI().toString());
        return contextHandler;
    }

    private void startStaticServer() throws Exception {
        Server server = new Server(80);
        ResourceHandler resource_handler = new ResourceHandler();
        resource_handler.setDirectoriesListed(true);
        resource_handler.setWelcomeFiles(new String[]{ "index.html" });
        resource_handler.setResourceBase(new ClassPathResource("static/app").getURI().toString());

        GzipHandler gzip = new GzipHandler();
        server.setHandler(gzip);
        HandlerList handlers = new HandlerList();
        handlers.setHandlers(new Handler[] { resource_handler, new DefaultHandler() });
        gzip.setHandler(handlers);

        server.start();
        server.join();
    }

}
