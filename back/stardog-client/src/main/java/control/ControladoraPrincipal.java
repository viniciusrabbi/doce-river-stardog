package control;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ImportResource;

import util.FileConverter;
 
@SpringBootApplication
@ImportResource("classpath:applicationContext.xml")
public class ControladoraPrincipal {
 
  public static void main(String[] args) throws Exception {
    SpringApplication.run(ControladoraPrincipal.class, args);
	//FileConverter.testSaveOntology();
  }
 
}